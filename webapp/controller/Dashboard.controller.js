sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "odata/metadata/manager/model/SAPLoginService",
  ],
  function (Controller, MessageToast, SAPLoginService) {
    "use strict";

    return Controller.extend(
      "odata.metadata.manager.controller.Dashboard",
      {
        // ─── Life-cycle ────────────────────────────────────────────────────
        onInit: function () {
          this._selectedServiceId = null;
          var that = this;

          var fnAttach = function (oModel) {
            if (!oModel || that._bModelAttached) return;
            that._bModelAttached = true;
            
            console.log("[Dashboard] Attaching change listeners to model bindings.");

            // Bind to /loading property
            var oLoadingBinding = oModel.bindProperty("/loading");
            oLoadingBinding.attachChange(function () {
              console.log("[Dashboard] Model /loading updated, re-rendering...");
              that._renderServiceList();
            });

            // Bind to /services collection
            var oServicesBinding = oModel.bindList("/services");
            oServicesBinding.attachChange(function () {
              console.log("[Dashboard] Model /services updated, re-rendering...");
              that._renderServiceList();
            });

            // Trigger initial render
            that._renderServiceList();
          };

          // 1. Try component model immediately
          var oComp = this.getOwnerComponent();
          if (oComp && oComp.getModel()) {
            fnAttach(oComp.getModel());
          }

          // 2. Also listen for View's model context change
          this.getView().attachModelContextChange(function () {
            var oModel = that.getView().getModel();
            if (oModel) {
              fnAttach(oModel);
            }
          });
        },

        onAfterRendering: function () {
          this._renderServiceList();
        },

        // ─── Top-bar actions ───────────────────────────────────────────────
        onSignOut: function () {
          SAPLoginService.logout();
          MessageToast.show("Logged out from S/4HANA");
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        },

        onExportAll: function () {
          MessageToast.show("Exporting all versions…");
        },

        onSchedule: function () {
          MessageToast.show("Opening scheduler configuration…");
        },

        onRegisterService: function () {
          MessageToast.show("Register new OData service…");
        },

        // ─── Filter handlers ───────────────────────────────────────────────
        onSearchChange: function (oEvent) {
          this._searchQuery = oEvent.getParameter("newValue") || "";
          this._applyFilters();
        },

        onTypeFilterChange: function (oEvent) {
          var oSource = oEvent.getSource();
          this._typeFilter =
            oEvent.getParameter("key") ||
            (oSource && oSource.getSelectedKey && oSource.getSelectedKey()) ||
            "All";
          this._applyFilters();
        },

        onPrefixFilterChange: function (oEvent) {
          var oSource = oEvent.getSource();
          this._prefixFilter =
            oEvent.getParameter("key") ||
            (oSource && oSource.getSelectedKey && oSource.getSelectedKey()) ||
            "All";
          this._applyFilters();
        },

        onStatusFilterChange: function (oEvent) {
          this._statusFilter = oEvent.getSource().getSelectedKey() || "All";
          this._applyFilters();
        },

        onShowDeletedToggle: function (oEvent) {
          this._showDeleted = oEvent.getSource().getPressed();
          this._applyFilters();
        },

        // ─── Dynamic service list rendering ────────────────────────────────
        /**
         * Render the service sidebar list dynamically from the model's /services.
         * Replaces the static hardcoded list items in the view.
         */
        _renderServiceList: function () {
          var oComp = this.getOwnerComponent();
          var oModel = this.getView().getModel() || (oComp ? oComp.getModel() : null);
          var aServices = oModel ? (oModel.getProperty("/services") || []) : [];
          var bLoading  = oModel ? !!oModel.getProperty("/loading") : true;

          // Use the VBox container — render pure HTML into its DOM node
          var oContainer = this.byId("serviceListContainer");
          if (!oContainer) return;
          var oDom = oContainer.getDomRef();
          if (!oDom) return;

          if (bLoading) {
            oDom.innerHTML =
              '<div style="padding:1.2rem;display:flex;align-items:center;gap:10px;color:#8a9ba8">' +
              '<span style="font-size:0.875rem">Loading services…</span></div>';
            return;
          }

          if (!aServices || aServices.length === 0) {
            oDom.innerHTML =
              '<div style="padding:1rem;color:#8a9ba8;font-size:0.875rem">No services found.</div>';
            return;
          }

          var that    = this;
          var sViewId = this.getView().getId();
          var html    = '';

          aServices.forEach(function (svc, i) {
            var bSelected = !that._selectedServiceId
              ? i === 0
              : svc.id === that._selectedServiceId;

            if (svc.is_deleted) return; // skip deleted by default

            var sDesc      = (svc.type || '—') + ' · ' + (svc.status || '—');
            var sInfo      = svc.versionsCount + ' version' + (svc.versionsCount !== 1 ? 's' : '');
            var sInfoColor = svc.status === 'Inactive' ? '#8a9ba8' : '#188918';
            var sSel       = bSelected ? ' serviceListItem-selected' : '';

            html +=
              '<div class="serviceListItem' + sSel + '" ' +
                  'data-service-id="' + _esc(svc.id) + '" ' +
                  'data-svc-type="' + _esc(svc.type || '') + '" ' +
                  'data-svc-prefix="' + _esc(svc.prefix || (svc.name || '').substring(0, 2)) + '" ' +
                  'data-svc-status="' + _esc(svc.status || '') + '" ' +
                  'data-svc-name="' + _esc((svc.name || '').toLowerCase()) + '" ' +
                  'onclick="sap.ui.getCore().byId(\'' + sViewId + '\').getController()._onServiceItemClick(\'' + svc.id + '\')">'+
                '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">'+
                  '<div style="min-width:0">'+
                    '<div class="sapMSLITitle" style="font-weight:600;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + _esc(svc.name) + '</div>'+
                    '<div class="sapMSLIDescription" style="font-size:0.75rem;color:#8a9ba8;margin-top:2px">' + _esc(sDesc) + '</div>'+
                  '</div>'+
                  '<div style="font-size:0.75rem;font-weight:600;color:' + sInfoColor + ';white-space:nowrap">' + _esc(sInfo) + '</div>'+
                '</div>'+
              '</div>';

            // Auto-select first visible service
            if (i === 0 && !that._selectedServiceId) {
              that._selectedServiceId = svc.id;
              setTimeout(function() { that._selectService(svc.id); }, 0);
            }
          });

          oDom.innerHTML = html;
          this._applyFilters();
          this._updateSidebarCount(aServices);
        },

        // Called from inline onclick on DOM service items
        _onServiceItemClick: function (sServiceId) {
          this._selectedServiceId = sServiceId;

          // Update selected state visually
          var oContainer = this.byId("serviceListContainer");
          if (oContainer && oContainer.getDomRef()) {
            var oDom = oContainer.getDomRef();
            oDom.querySelectorAll(".serviceListItem").forEach(function (el) {
              el.classList.remove("serviceListItem-selected");
            });
            var oEl = oDom.querySelector('[data-service-id="' + sServiceId + '"]');
            if (oEl) oEl.classList.add("serviceListItem-selected");
          }

          this._selectService(sServiceId);
        },

        // Legacy handlers (kept for XML event references that may still exist)
        onServicePress:  function () {},
        onServiceSelect: function () {},

        _selectService: function (sServiceId) {
          this._selectedServiceId = sServiceId;

          var oModel = this.getOwnerComponent().getModel();
          var aServices = oModel.getProperty("/services") || [];
          var oService = aServices.find(function (s) {
            return s.id === sServiceId;
          });
          if (!oService) return;

          // ── Update detail header ───────────────────────────────────────
          var oName = this.byId("detailServiceName");
          if (oName) oName.setText(oService.name);

          var oSubtext = this.byId("detailSubtext");
          if (oSubtext) {
            oSubtext.setText(
              "Owner: " + oService.owner +
              " · Registered: " + this._formatDate(oService.registeredAt) +
              " · Last change: " + this._formatDate(oService.lastChangeAt)
            );
          }

          // ── Update DOM badges in detail header ────────────────────────
          this._updateDetailBadges(oService);

          // ── Render version cards for selected service ─────────────────
          this._renderVersionCards(oService);
        },

        _updateDetailBadges: function (oService) {
          var oPanel = this.byId("detailPanel");
          if (!oPanel || !oPanel.getDomRef()) return;
          var oDom = oPanel.getDomRef();

          var prefixEl = oDom.querySelector(".detailPrefixBadge");
          if (prefixEl) {
            prefixEl.textContent = oService.prefix || oService.name.substring(0, 2);
          }
          var typeEl = oDom.querySelector(".detailTypeBadge");
          if (typeEl) {
            typeEl.textContent = oService.type || "—";
          }
          var statusEl = oDom.querySelector(".detailStatusBadge");
          if (statusEl) {
            statusEl.textContent = oService.status || "—";
          }
        },

        // ─── Version cards rendering ────────────────────────────────────────
        /**
         * Dynamically render version cards into #versionListContainer
         * replacing the static view XML cards.
         */
        _renderVersionCards: function (oService) {
          var oContainer = this.byId("versionListContainer");
          if (!oContainer) return;

          var oDom = oContainer.getDomRef();
          if (!oDom) {
            // Retry after render
            oContainer.addEventDelegate({
              onAfterRendering: function () {
                this._renderVersionCards(oService);
              }.bind(this),
            });
            return;
          }

          var aVersions = oService.versions || [];
          var sGroupId = oService.groupId || oService.id;

          if (aVersions.length === 0) {
            oDom.innerHTML =
              '<div style="padding:1rem;color:#8a9ba8;font-size:0.875rem">' +
              "No versions found for this service." +
              "</div>";
            return;
          }

          var that = this;
          var html = "";

          aVersions.forEach(function (v) {
            var bLatest = v.isLatest;
            var sTrigger = v.triggerText || (v.triggerType === "A" ? "🤖 Auto" : "👤 Manual");
            var sDate = that._formatDate(v.createdAt);
            var sCardClass = "versionCard" + (bLatest ? " versionCard-latest" : "");

            html +=
              '<div class="' + sCardClass + '" data-version-id="' + v.versionId + '" data-group-id="' + sGroupId + '">' +
                '<div class="versionCardHeader" style="display:flex;align-items:center">' +
                  '<div class="versionCardHeaderLeft" style="display:flex;align-items:center;gap:6px">' +
                    '<span class="versionVersion">v' + v.versionNo + "</span>" +
                    (bLatest ? '<span class="badge badge-latest">Latest</span>' : "") +
                    '<span class="badge ' + (v.triggerType === "A" ? "badge-auto" : "badge-manual") + '">' + sTrigger + "</span>" +
                  "</div>" +
                  '<div style="flex:1"></div>' +
                  '<div class="versionCardHeaderRight">' +
                    '<span class="versionDate">' + sDate + "</span>" +
                  "</div>" +
                "</div>" +
                '<div class="versionMeta" style="display:flex;align-items:center;gap:4px;margin:4px 0">' +
                  '<span class="versionMetaText">' + v.createdBy + "</span>" +
                  '<span class="versionDot">·</span>' +
                  '<span class="versionMetaText" style="font-family:monospace;font-size:0.75rem">' +
                    (v.hash ? v.hash.substring(0, 16) : "—") +
                  "</span>" +
                "</div>" +
                '<div class="versionActions">' +
                  '<button class="sapMBtn sapMBtnBase sapMBtnDefault versionBtn" onclick="' +
                    'sap.ui.getCore().byId(\'' + that.getView().getId() + '\').getController()._onViewVersionClick(\'' +
                    v.versionId + "','" + sGroupId + '\')">' +
                    '<span class="sapMBtnIcon sapUiIcon">&#xe052;</span>View</button>' +
                  '<button class="sapMBtn sapMBtnBase sapMBtnDefault versionBtn" onclick="' +
                    'sap.ui.getCore().byId(\'' + that.getView().getId() + '\').getController()._onCompareVersionClick(\'' +
                    v.versionId + "','" + sGroupId + '\')">' +
                    '<span class="sapMBtnIcon sapUiIcon">&#xe2ce;</span>Compare…</button>' +
                "</div>" +
              "</div>";
          });

          oDom.innerHTML = html;
        },

        // Called from inline onclick in dynamic version cards
        _onViewVersionClick: function (sVersionId, sGroupId) {
          this.getOwnerComponent().getRouter().navTo("snapshotDetail", {
            service: sGroupId,
            version: sVersionId,
          });
        },

        _onCompareVersionClick: function (sVersionId, sGroupId) {
          this.getOwnerComponent().getRouter().navTo("versionCompare", {
            service: sGroupId,
          });
        },

        // ─── Filter engine ─────────────────────────────────────────────────
        _applyFilters: function () {
          var sSearch  = (this._searchQuery || "").toLowerCase();
          var sType    = this._typeFilter   || "All";
          var sPrefix  = this._prefixFilter || "All";
          var sStatus  = this._statusFilter || "All";
          var bDeleted = this._showDeleted  || false;

          var oContainer = this.byId("serviceListContainer");
          if (!oContainer || !oContainer.getDomRef()) return;
          var oDom = oContainer.getDomRef();

          var aVisible = [];
          oDom.querySelectorAll(".serviceListItem").forEach(function (el) {
            var sName   = el.getAttribute("data-svc-name")   || "";
            var sT      = el.getAttribute("data-svc-type")   || "";
            var sP      = el.getAttribute("data-svc-prefix") || "";
            var sSt     = el.getAttribute("data-svc-status") || "";

            var bShow = true;
            if (sSearch && sName.indexOf(sSearch) < 0) bShow = false;
            if (sType   !== "All" && sT  !== sType)   bShow = false;
            if (sPrefix !== "All" && sP  !== sPrefix) bShow = false;
            if (sStatus !== "All" && sSt !== sStatus) bShow = false;

            el.style.display = bShow ? "" : "none";
            if (bShow) aVisible.push(el);
          });

          this._updateSidebarCount(aVisible);
        },

        _updateSidebarCount: function (aFiltered) {
          var oCountTitle = this.byId("sidebarCount");
          if (oCountTitle) {
            oCountTitle.setText(
              (aFiltered ? aFiltered.length : 0) +
                " service" +
                (aFiltered && aFiltered.length !== 1 ? "s" : "")
            );
          }
        },

        // ─── Version actions ──────────────────────────────────────────────
        onViewVersion: function (oEvent) {
          var oBtn = oEvent.getSource();
          var sVersion = oBtn.data("version") || "";
          var sService = this._selectedServiceId || "";
          this.getOwnerComponent().getRouter().navTo("snapshotDetail", {
            service: sService,
            version: sVersion,
          });
        },

        onDownloadVersion: function () {
          MessageToast.show("Downloading version XML…");
        },

        onAnalyseVersion: function () {
          MessageToast.show("Analysing version…");
        },

        onCompareVersion: function () {
          this.onNavigateCompare();
        },

        // ─── Navigation ────────────────────────────────────────────────────
        onNavigateCompare: function () {
          var sGroupId = this._selectedServiceId || "";
          this.getOwnerComponent().getRouter().navTo("versionCompare", {
            service: sGroupId,
          });
        },

        onWorkflow: function () {
          var oModel = this.getOwnerComponent().getModel();
          var aServices = oModel.getProperty("/services") || [];
          var oService = aServices.find(function (s) {
            return s.id === this._selectedServiceId;
          }.bind(this));
          if (oService && oService.latestVersionId) {
            this.getOwnerComponent().getRouter().navTo("snapshotDetail", {
              service: oService.groupId || oService.id,
              version: oService.latestVersionId,
            });
          } else {
            MessageToast.show("Select a service with at least one version first.");
          }
        },

        onTakeSnapshot: function () {
          var that = this;
          var oDataService = this.getOwnerComponent().getDataService &&
            this.getOwnerComponent().getDataService();
          var sGroupId = this._selectedServiceId;

          if (!oDataService || !sGroupId || !oDataService.generateVersion) {
            MessageToast.show("No service selected.");
            return;
          }

          MessageToast.show("Taking manual snapshot…");
          oDataService
            .generateVersion(sGroupId)
            .then(function (oResult) {
              MessageToast.show(
                "Snapshot created: v" + (oResult.VersionNo || "?")
              );
              // Reload Registry to refresh counts & version list
              oDataService.fetchRegistry().then(function (oData) {
                var aServices = oDataService.mapRegistryToServices(oData.value || []);
                that.getOwnerComponent().getModel().setProperty("/services", aServices);
                that._renderServiceList();
              });
            })
            .catch(function (oErr) {
              MessageToast.show("Snapshot failed: " + oErr.message);
            });
        },

        // ─── Footer / export ───────────────────────────────────────────────
        onExportAllZip: function () {
          MessageToast.show("Preparing ZIP of all versions…");
        },

        onExportSelected: function () {
          MessageToast.show("Select versions to export…");
        },

        // ─── Scheduler ────────────────────────────────────────────────────
        onConfigureScheduler: function () {
          MessageToast.show("Opening scheduler settings…");
        },

        // ─── Helpers ──────────────────────────────────────────────────────
        _formatDate: function (sIso) {
          if (!sIso) return "—";
          try {
            var oDate = new Date(sIso);
            if (isNaN(oDate.getTime())) return sIso;
            return oDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          } catch (e) {
            return sIso;
          }
        },
      }
    );

    // Module-level HTML escape helper
    function _esc(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  }
);
