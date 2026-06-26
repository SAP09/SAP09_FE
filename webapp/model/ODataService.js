sap.ui.define(
  [
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/odata/v4/ODataModel",
    "odata/metadata/manager/model/Config",
    "odata/metadata/manager/model/SAPLoginService",
  ],
  function (ODataModelV2, ODataModelV4, Config, SAPLoginService) {
    "use strict";

    return {
      /**
       * Create an ODataService instance wired to the SAP backend directly.
       * Authentication is handled by the frontend using Basic auth.
       *
       * Backend: https://s40lp1.ucc.cit.tum.de
       * Service: /sap/opu/odata4/sap/zsb_gsugp9/srvd_a2x/sap/zsr_registry/0001/
       *
       * @param {sap.ui.core.UIComponent} oComponent - Component reference
       * @returns {Object} Service object with read/create/update/delete/query methods
       */
      createInstance: function (oComponent) {
        var sODataVersion = Config.ODATA_VERSION;   // "v4"
        var sBackendUrl   = Config.BACKEND_URL;     // "/backend/"
        var sSapClient    = Config.SAP_CLIENT;      // "324"

        var oModel;
        var oHeaders = {
          "sap-client": sSapClient,
        };

        if (Config.AUTH_TYPE === "basic-per-user" && SAPLoginService.isLoggedIn()) {
          oHeaders["Authorization"] = SAPLoginService.getAuthHeader();
        }

        if (sODataVersion === "v4") {
          // ── OData V4 Model ────────────────────────────────────────────────────
          // serviceUrl is passed inside the settings object (not as the first arg).
          // v2-only options (json, metadataUrlParams, defaultBindingMode, timeout)
          // must NOT be passed to the v4 constructor — they cause silent failures.
          oModel = new ODataModelV4({
            serviceUrl:          sBackendUrl,
            synchronizationMode: "None",
            operationMode:       "Server",
            autoExpandSelect:    true,
            httpHeaders:         oHeaders,
          });
        } else {
          // ── OData V2 Model (fallback) ─────────────────────────────────────────
          oModel = new ODataModelV2(sBackendUrl, {
            defaultBindingMode: "TwoWay",
            metadataUrlParams:  { "sap-client": sSapClient },
            json:               true,
            timeout:            Config.REQUEST_TIMEOUT,
            headers:            oHeaders,
          });
        }

        return {
          /**
           * Verify the backend is reachable.
           * For OData v4 the model loads metadata lazily on first binding;
           * readiness is signalled immediately so the router can start.
           *
           * @param {Function} fnSuccess - Called when service is ready
           * @param {Function} fnError   - Called on metadata failure (v2 only)
           */
          read: function (fnSuccess, fnError) {
            if (sODataVersion === "v4") {
              // V4: actual data arrives via list/context bindings in views.
              if (fnSuccess) {
                fnSuccess();
              }
            } else {
              oModel.attachMetadataLoaded(function () {
                if (fnSuccess) { fnSuccess(); }
              });
              oModel.attachMetadataFailed(function (oEvent) {
                if (fnError) { fnError(oEvent); }
              });
            }
          },

          /**
           * Create a new entity via OData
           * @param {string} sEntitySet - Key from Config.ENTITY_SETS (e.g. "registry")
           * @param {Object} oData      - Entity payload
           * @param {Function} fnSuccess
           * @param {Function} fnError
           */
          create: function (sEntitySet, oData, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet);
            oModel.create(sPath, oData, {
              success: fnSuccess,
              error:   fnError,
              async:   true,
            });
          },

          /**
           * Update an entity via OData
           * @param {string} sEntitySet - Key from Config.ENTITY_SETS
           * @param {string} sKey       - OData key predicate (e.g. "GroupId=guid'...'")
           * @param {Object} oData      - Updated fields
           * @param {Function} fnSuccess
           * @param {Function} fnError
           */
          update: function (sEntitySet, sKey, oData, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet) + "(" + sKey + ")";
            oModel.update(sPath, oData, {
              success: fnSuccess,
              error:   fnError,
              async:   true,
            });
          },

          /**
           * Delete an entity via OData
           * @param {string} sEntitySet - Key from Config.ENTITY_SETS
           * @param {string} sKey       - OData key predicate
           * @param {Function} fnSuccess
           * @param {Function} fnError
           */
          delete: function (sEntitySet, sKey, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet) + "(" + sKey + ")";
            oModel.remove(sPath, {
              success: fnSuccess,
              error:   fnError,
              async:   true,
            });
          },

          /**
           * Query an entity set with optional OData URL parameters
           * @param {string} sEntitySet - Key from Config.ENTITY_SETS
           * @param {Object} oFilters   - OData URL params (e.g. $filter, $top, $expand)
           * @param {Function} fnSuccess - Receives array of results
           * @param {Function} fnError
           */
          query: function (sEntitySet, oFilters, fnSuccess, fnError) {
            var sPath    = "/" + Config.getEntitySet(sEntitySet);
            var oRequest = { urlParameters: oFilters, async: true };

            oModel.read(sPath, {
              ...oRequest,
              success: function (oData) {
                if (fnSuccess) {
                  fnSuccess(oData.results || oData.value || oData);
                }
              },
              error: fnError,
            });
          },

          /**
           * Get the underlying OData model (for direct view/list binding)
           * @returns {sap.ui.model.odata.v4.ODataModel}
           */
          getModel: function () {
            return oModel;
          },

          /**
           * Return service status information
           * @returns {Object}
           */
          getStatus: function () {
            return {
              isOnline:     true,
              isMock:       false,
              backend:      sBackendUrl,
              odataVersion: sODataVersion,
              sapClient:    sSapClient,
            };
          },
        };
      },
    };
  }
);
