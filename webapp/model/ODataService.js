sap.ui.define(
  [
    "odata/metadata/manager/model/Config",
    "odata/metadata/manager/model/SAPLoginService",
  ],
  function (Config, SAPLoginService) {
    "use strict";

    // Fully-qualified namespace prefix used for all bound action URLs
    var NAMESPACE = "com.sap.gateway.srvd_a2x.zsr_registry.v0001";

    return {
      /**
       * Create a fetch-based OData v4 service instance.
       * All methods return native Promises.
       *
       * @param {sap.ui.core.UIComponent} oComponent - Component reference (unused but kept for API compat)
       * @returns {Object} Service object
       */
      createInstance: function (oComponent) {
        var sBaseUrl = Config.BACKEND_URL.replace(/\/$/, ""); // strip trailing slash
        var sSapClient = Config.SAP_CLIENT;

        // ─── Private helpers ──────────────────────────────────────────────

        /**
         * Build request headers, optionally adding X-CSRF-Token: Fetch
         */
        function _headers(bFetchCsrf) {
          var h = {
            Accept: "application/json",
            "sap-client": sSapClient,
          };
          if (SAPLoginService.isLoggedIn()) {
            h["Authorization"] = SAPLoginService.getAuthHeader();
          }
          if (bFetchCsrf) {
            h["X-CSRF-Token"] = "Fetch";
          }
          return h;
        }

        /**
         * Execute a GET request; rejects on non-2xx status.
         * @param {string} sPath - relative path (starts with /)
         * @returns {Promise<Object>} Parsed JSON body
         */
        function _get(sPath) {
          return fetch(sBaseUrl + sPath, {
            method: "GET",
            headers: _headers(false),
          }).then(function (res) {
            if (!res.ok) {
              return res.text().then(function (txt) {
                throw new Error("GET " + sPath + " → HTTP " + res.status + " " + txt);
              });
            }
            return res.json();
          });
        }

        /**
         * Fetch a CSRF token required for write operations.
         * Tries the service root and falls back to $metadata if necessary.
         * @returns {Promise<string>} CSRF token value
         */
        function _getCsrfToken() {
          function fetchTokenFromUrl(sUrl, headers) {
            return fetch(sUrl, {
              method: "GET",
              headers: headers,
            }).then(function (res) {
              var sToken = res.headers.get("X-CSRF-Token") || "";
              return sToken;
            });
          }

          var sBaseRoot = sBaseUrl.replace(/\/+$/, "") + "/";
          var oHeaders = Object.assign({}, _headers(true), {
            "OData-Version": "4.0",
            "OData-MaxVersion": "4.0",
            "Cache-Control": "no-cache",
          });

          return fetchTokenFromUrl(sBaseRoot, oHeaders).then(function (sToken) {
            if (sToken) {
              return sToken;
            }
            // Some services return CSRF headers only for metadata requests
            return fetchTokenFromUrl(sBaseRoot + "$metadata", oHeaders);
          });
        }

        /**
         * Execute a POST (bound action). Fetches CSRF token first.
         * @param {string} sPath  - relative action URL
         * @param {Object} [oBody] - optional JSON payload
         * @returns {Promise<Object>} Parsed JSON response body
         */
        function _post(sPath, oBody) {
          return _getCsrfToken().then(function (sToken) {
            var h = _headers(false);
            h["Content-Type"] = "application/json;charset=UTF-8";
            h["OData-Version"] = "4.0";
            if (sToken) {
              h["X-CSRF-Token"] = sToken;
            }
            return fetch(sBaseUrl + sPath, {
              method: "POST",
              headers: h,
              body: oBody ? JSON.stringify(oBody) : "{}",
            });
          }).then(function (res) {
            if (!res.ok) {
              return res.text().then(function (txt) {
                throw new Error("POST " + sPath + " → HTTP " + res.status + " " + txt);
              });
            }
            return res.json();
          });
        }

        // ─── Public API ────────────────────────────────────────────────────

        return {
          /**
           * Fetch all Registry entries, each with their child Versions.
           * Used by Component.js on startup to populate the main JSONModel.
           *
           * GET /Registry?$expand=_Version&$orderby=LastChangeAt desc
           * @returns {Promise<{value: Array}>}
           */
          fetchRegistry: function () {
            return _get("/Registry?$expand=_Version&$orderby=LastChangeAt desc");
          },

          /**
           * Fetch all Versions for a given Group, each with their child Details.
           * Used by SnapshotDetail and VersionCompare to resolve DetailIds.
           *
           * GET /Version?$filter=GroupId eq <guid>&$expand=_Detail&$orderby=VersionNo desc
           * @param {string} sGroupId - GroupId GUID string (no quotes)
           * @returns {Promise<{value: Array}>}
           */
          fetchVersionsForGroup: function (sGroupId) {
            return _get(
              "/Version?$filter=GroupId eq " +
                sGroupId +
                "&$expand=_Detail&$orderby=VersionNo desc"
            );
          },

          /**
           * Call the bound action getParseMetadata on a Detail entity.
           * Returns the raw $metadata XML for that version snapshot.
           *
           * POST /Detail(DetailId=<guid>)/NAMESPACE.getParseMetadata
           * @param {string} sDetailId - DetailId GUID string
           * @returns {Promise<{DetailId: string, MetadataXml: string}>}
           */
          fetchDetailXml: function (sDetailId) {
            return _post(
              "/Detail(DetailId=" + sDetailId + ")/" + NAMESPACE + ".getParseMetadata"
            );
          },

          /**
           * Call the bound Compare action on a Detail entity.
           * Returns full structural + XML diff between two snapshots.
           *
           * POST /Detail(DetailId=<guid>)/NAMESPACE.Compare
           * Body: { compare_detail_id: <guid> }
           *
           * @param {string} sDetailId        - Base detail ID
           * @param {string} sCompareDetailId - Compare-against detail ID
           * @returns {Promise<ZDDETAILCOMPARERESULT>}
           */
          compareDetails: function (sDetailId, sCompareDetailId) {
            // Primary attempt: namespaced bound action
            var sPrimary = "/Detail(DetailId=" + sDetailId + ")/" + NAMESPACE + ".Compare";
            var sAltNoNs  = "/Detail(DetailId=" + sDetailId + ")/Compare";
            var sAltLower = "/Detail(DetailId=" + sDetailId + ")/" + NAMESPACE + ".compare";

            return _post(sPrimary, { compare_detail_id: sCompareDetailId }).catch(function (err) {
              // If 404 / resource not found, try a couple of common alternate URIs
              var msg = String(err || "");
              if (msg.indexOf("HTTP 404") >= 0 || msg.indexOf("Resource not found") >= 0) {
                console.warn("[ODataService] compareDetails: primary URI failed, trying alternate URIs.");
                return _post(sAltNoNs, { compare_detail_id: sCompareDetailId })
                  .catch(function (err2) {
                    // final attempt with lowercase action name
                    return _post(sAltLower, { compare_detail_id: sCompareDetailId });
                  });
              }
              // Not a 404 — rethrow so caller can handle
              throw err;
            });
          },

          /**
           * Call the bound generateVersion action on a Registry entity.
           * Triggers a manual snapshot for the given service group.
           *
           * POST /Registry(GroupId=<guid>)/NAMESPACE.generateVersion
           * @param {string} sGroupId - GroupId GUID string
           * @returns {Promise<ZI_VERSION_RESULT>}
           */
          generateVersion: function (sGroupId) {
            return _post(
              "/Registry(GroupId=" + sGroupId + ")/" + NAMESPACE + ".generateVersion"
            );
          },

          /**
           * Map a raw Registry response value array into the JSONModel shape
           * expected by all views (services[], with nested versions[]).
           *
           * @param {Array} aRegistries - value array from fetchRegistry()
           * @returns {Array} Mapped services array
           */
          mapRegistryToServices: function (aRegistries) {
            return aRegistries.map(function (reg) {
              // Sort versions descending by VersionNo (numeric)
              var aVersions = (reg._Version || []).slice().sort(function (a, b) {
                return parseInt(b.VersionNo, 10) - parseInt(a.VersionNo, 10);
              });

              var oLatest = aVersions[0] || null;

              return {
                // ── IDs (real GUIDs from BE) ──────────────────
                id: reg.GroupId,
                groupId: reg.GroupId,

                // ── Display fields ────────────────────────────
                name: reg.GroupName,
                type: reg.GroupTypeText || reg.GroupType || "—",
                prefix: (reg.GroupName || "").substring(0, 2),
                status: reg.StatusText || reg.Status || "—",
                is_deleted: reg.Status === "D",
                owner: reg.RegisteredBy || "—",
                description: reg.Description || "",
                registeredAt: reg.RegisteredAt,
                lastChangeAt: reg.LastChangeAt,

                // ── Version counts ────────────────────────────
                versionsCount: aVersions.length,
                latestVersionNo: oLatest ? oLatest.VersionNo : "0",
                latestVersionId: oLatest ? oLatest.VersionId : null,
                latestDetailId:
                  oLatest && oLatest._Detail && oLatest._Detail[0]
                    ? oLatest._Detail[0].DetailId
                    : null,

                // ── All versions (mapped) ─────────────────────
                versions: aVersions.map(function (v) {
                  return {
                    versionId: v.VersionId,
                    groupId: v.GroupId,
                    versionNo: v.VersionNo,
                    hash: v.GroupHash || "",
                    status: v.StatusText || v.Status || "—",
                    createdBy: v.CreatedBy || "—",
                    createdAt: v.CreatedAt,
                    triggerType: v.TriggerType,
                    triggerText: v.TriggerText || (v.TriggerType === "A" ? "Auto" : "Manual"),
                    isLatest: v.LatestVersion === true,
                    // First Detail's ID — used for XML fetch + Compare action
                    detailId:
                      v._Detail && v._Detail[0] ? v._Detail[0].DetailId : null,
                  };
                }),
              };
            });
          },

          /**
           * Legacy entry point called by Component.js _initializeModel().
           * Fetches Registry + maps to model; calls fnSuccess({ services }) on success.
           *
           * @param {Function} fnSuccess
           * @param {Function} fnError
           */
          read: function (fnSuccess, fnError) {
            var that = this;
            this.fetchRegistry()
              .then(function (oData) {
                var aServices = that.mapRegistryToServices(oData.value || []);
                if (fnSuccess) {
                  fnSuccess({ services: aServices });
                }
              })
              .catch(function (oError) {
                console.error("[ODataService] fetchRegistry failed:", oError);
                if (fnError) {
                  fnError(oError);
                }
              });
          },

          /**
           * Return service status information
           * @returns {Object}
           */
          getStatus: function () {
            return {
              isOnline: true,
              isMock: false,
              backend: sBaseUrl,
              odataVersion: Config.ODATA_VERSION,
              sapClient: sSapClient,
            };
          },
        };
      },
    };
  }
);
