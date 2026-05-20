sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("odata.metadata.manager.controller.Dashboard", {

        // ─── Life-cycle ────────────────────────────────────────────────────
        onInit: function () {
            // Defer filters until component model is fully loaded and view has inherited it
            this.getView().attachModelContextChange(function () {
                var oComp = this.getOwnerComponent();
                var oModel = oComp ? oComp.getModel() : null;
                if (oModel) {
                    this._applyFilters();
                }
            }.bind(this));
        },

        // ─── Top-bar actions ───────────────────────────────────────────────
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
            this._typeFilter = oEvent.getParameter("key") || "All";
            this._applyFilters();
        },

        onPrefixFilterChange: function (oEvent) {
            this._prefixFilter = oEvent.getParameter("key") || "All";
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

        // ─── Service selection ─────────────────────────────────────────────
        onServicePress: function (oEvent) {
            var oItem = oEvent.getSource();
            var sServiceId = oItem.data("serviceId");
            if (!sServiceId) {
                // fallback from list item press
                oItem = oEvent.getParameter("listItem") || oItem;
                sServiceId = oItem.data("serviceId");
            }
            if (sServiceId) {
                this._selectService(sServiceId);
            }
        },

        onServiceSelect: function (oEvent) {
            var oListItem = oEvent.getParameter("listItem");
            if (oListItem) {
                var sServiceId = oListItem.data("serviceId");
                if (sServiceId) {
                    this._selectService(sServiceId);
                }
            }
        },

        _selectService: function (sServiceId) {
            var oModel = this.getOwnerComponent().getModel();
            var aServices = oModel.getProperty("/services") || [];
            var oService = aServices.find(function (s) { return s.id === sServiceId; });
            if (!oService) return;

            // Update detail panel
            this.byId("detailServiceName").setText(oService.name);
            this.byId("detailSubtext").setText(
                "Namespace: " + oService.namespace +
                " · Package: " + oService.package +
                " · Owner: " + oService.owner
            );

            // Update badges
            this._updateDetailBadges(oService);
        },

        _updateDetailBadges: function (oService) {
            // Update prefix badge
            var oPrefixBadge = this.byId("detailPanel").getDomRef();
            if (oPrefixBadge) {
                var prefixEl = oPrefixBadge.querySelector(".detailPrefixBadge");
                if (prefixEl) {
                    prefixEl.textContent = oService.prefix;
                    prefixEl.className = "badge badge-" + oService.prefix.toLowerCase() + " detailPrefixBadge";
                }
                var typeEl = oPrefixBadge.querySelector(".detailTypeBadge");
                if (typeEl) {
                    typeEl.textContent = oService.type;
                    typeEl.className = "badge badge-" + oService.type.toLowerCase() + " detailTypeBadge";
                }
                var statusEl = oPrefixBadge.querySelector(".detailStatusBadge");
                if (statusEl) {
                    statusEl.textContent = oService.status;
                    statusEl.className = "badge badge-" + oService.status.toLowerCase() + " detailStatusBadge";
                }
            }
        },

        // ─── Filter engine ─────────────────────────────────────────────────
        _applyFilters: function () {
            var sSearch  = (this._searchQuery  || "").toLowerCase();
            var sType    = this._typeFilter    || "All";
            var sPrefix  = this._prefixFilter  || "All";
            var sStatus  = this._statusFilter  || "All";
            var bDeleted = this._showDeleted   || false;

            var oModel   = this.getOwnerComponent().getModel();
            var aAll     = oModel.getProperty("/services") || [];

            var aFiltered = aAll.filter(function (svc) {
                if (svc.is_deleted && !bDeleted) return false;
                if (sSearch  && svc.name.toLowerCase().indexOf(sSearch)  < 0) return false;
                if (sType   !== "All" && svc.type   !== sType)   return false;
                if (sPrefix !== "All" && svc.prefix !== sPrefix) return false;
                if (sStatus !== "All" && svc.status !== sStatus) return false;
                return true;
            });

            // Show/hide list items by their DOM id
            aAll.forEach(function (svc) {
                var oItem = this.byId("svc_" + svc.id);
                if (oItem) {
                    var bVisible = aFiltered.some(function (f) { return f.id === svc.id; });
                    oItem.setVisible(bVisible);
                }
            }.bind(this));

            // Update count label
            var oCountTitle = this.byId("sidebarCount");
            if (oCountTitle) {
                oCountTitle.setText(aFiltered.length + " services" + (bDeleted ? " (incl. deleted)" : ""));
            }
        },

        // ─── Snapshot actions ──────────────────────────────────────────────
        onViewSnapshot: function (oEvent) {
            var oBtn    = oEvent.getSource();
            var sVersion = oBtn.data("version") || "v7";
            this.getOwnerComponent().getRouter().navTo("snapshotDetail", {
                service: "ZMM_PURCHASE_SRV",
                version: sVersion
            });
        },

        onDownloadSnapshot: function () {
            MessageToast.show("Downloading snapshot XML…");
        },

        onAnalyseSnapshot: function () {
            MessageToast.show("Analysing snapshot…");
        },

        onCompareSnapshot: function () {
            this.onNavigateCompare();
        },

        // ─── Navigation ────────────────────────────────────────────────────
        onNavigateCompare: function () {
            this.getOwnerComponent().getRouter().navTo("versionCompare", {
                service: "ZMM_PURCHASE_SRV"
            });
        },

        onWorkflow: function () {
            this.getOwnerComponent().getRouter().navTo("snapshotDetail", {
                service: "ZMM_PURCHASE_SRV",
                version: "v7"
            });
        },

        onTakeSnapshot: function () {
            MessageToast.show("Taking manual snapshot…");
        },

        // ─── Footer / export ───────────────────────────────────────────────
        onExportAllZip: function () {
            MessageToast.show("Preparing ZIP of all 7 versions…");
        },

        onExportSelected: function () {
            MessageToast.show("Select versions to export…");
        },

        // ─── Scheduler ────────────────────────────────────────────────────
        onConfigureScheduler: function () {
            MessageToast.show("Opening scheduler settings…");
        }
    });
});
