sap.ui.define([], function () {
  "use strict";

  return {
    // ─── Backend Configuration ──────────────────────────────────────────
    // RAP OData v4 backend is now active — proxied via SAP Approuter
    BACKEND_ENABLED: true,

    // Relative URL through approuter /backend proxy route.
    // Approuter maps: /backend/* → https://s40lp1.ucc.cit.tum.de
    //   /sap/opu/odata4/sap/zsb_gsugp9/srvd_a2x/sap/zsr_registry/0001/*
    BACKEND_URL: "/backend/",

    // SAP client number for the TU Munich training system
    SAP_CLIENT: "324",

    // OData Version: confirmed v4 from metadata Version="4.0"
    ODATA_VERSION: "v4",

    // ─── Entity Sets — mapped from <EntityContainer> in OData metadata ─
    // Namespace: com.sap.gateway.srvd_a2x.zsr_registry.v0001
    ENTITY_SETS: {
      registry: "Registry",   // OData Service Registry  (R/W/U, no delete)
      version: "Version",    // Version snapshots        (read-only)
      detail: "Detail",     // Structural analysis      (read-only)
      log: "Log",        // Audit log                (read-only)
    },

    // Auth is handled per user via frontend login dialog forwarding credentials.
    AUTH_TYPE: "basic-per-user",

    // Request timeout in milliseconds
    REQUEST_TIMEOUT: 30000,

    // Enable request/response logging
    DEBUG_MODE: true,

    // ─── Helper Methods ────────────────────────────────────────────────

    /**
     * Check if backend is enabled
     * @returns {boolean}
     */
    isBackendEnabled: function () {
      return this.BACKEND_ENABLED && this.BACKEND_URL !== "";
    },

    /**
     * Get entity set name for given resource key
     * @param {string} sResource - Resource key (e.g. "registry", "version")
     * @returns {string} OData entity set name
     */
    getEntitySet: function (sResource) {
      return this.ENTITY_SETS[sResource] || sResource;
    },

    /**
     * Get OData v4 model settings for component initialization
     * @returns {Object} Model settings object
     */
    getODataModelSettings: function () {
      return {
        type: "sap.ui.model.odata.v4.ODataModel",
        uri: this.BACKEND_URL,
        settings: {
          synchronizationMode: "None",
          operationMode: "Server",
          autoExpandSelect: true,
          httpHeaders: {
            "sap-client": this.SAP_CLIENT,
          },
        },
      };
    },

    /**
     * Get JSON model settings (for mock data fallback)
     * @returns {Object} Model settings object
     */
    getJSONModelSettings: function () {
      return {
        type: "sap.ui.model.json.JSONModel",
        settings: {
          defaultBindingMode: "TwoWay",
        },
      };
    },

    /**
     * Log configuration for debugging
     */
    logConfiguration: function () {
      if (this.DEBUG_MODE) {
        console.log("=== SAP09 Data Service Configuration ===");
        console.log("Backend Enabled:", this.isBackendEnabled());
        console.log("Backend URL    :", this.BACKEND_URL);
        console.log("SAP Client     :", this.SAP_CLIENT);
        console.log("OData Version  :", this.ODATA_VERSION);
        console.log("Auth Type      :", this.AUTH_TYPE);
        console.log("Entity Sets    :", this.ENTITY_SETS);
      }
    },
  };
});

