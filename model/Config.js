sap.ui.define([], function () {
  "use strict";

  return {
    // ─── Backend Configuration ──────────────────────────────────────────
    // Set to true when RAP backend is ready and configured
    BACKEND_ENABLED: false,

    // Backend service URL (activate when BACKEND_ENABLED is true)
    // Format: https://<host>:<port>/sap/opu/odata/sap/<RAP_SERVICE>
    // Example: "https://sap-system.example.com:8443/sap/opu/odata/sap/ZMM_METADATA_SRV"
    BACKEND_URL: "",

    // OData Version: "v2" or "v4"
    // Most RAP services default to v4
    ODATA_VERSION: "v4",

    // Entity set mappings for OData binding
    // Update these when connecting to actual RAP backend
    ENTITY_SETS: {
      services: "Services",           // Mock: "services", RAP: "Services"
      snapshots: "Snapshots",         // Mock: "snapshots", RAP: "Snapshots"
      compareData: "CompareData",     // Mock: "compareData", RAP: "CompareData"
      snapshotDetail: "SnapshotDetails", // Mock: "snapshotDetail", RAP: "SnapshotDetails"
    },

    // Authentication type: "None", "Basic", "OAuth", "SAML"
    AUTH_TYPE: "None",

    // Request timeout in milliseconds
    REQUEST_TIMEOUT: 30000,

    // Enable request/response logging
    DEBUG_MODE: false,

    // ─── Helper Methods ────────────────────────────────────────────────

    /**
     * Check if backend is enabled
     * @returns {boolean}
     */
    isBackendEnabled: function () {
      return this.BACKEND_ENABLED && this.BACKEND_URL !== "";
    },

    /**
     * Get entity set name for given resource
     * @param {string} sResource - Resource key (e.g., "services", "snapshots")
     * @returns {string} Entity set name
     */
    getEntitySet: function (sResource) {
      return this.ENTITY_SETS[sResource] || sResource;
    },

    /**
     * Get OData model settings for component initialization
     * @returns {Object} Model settings object
     */
    getODataModelSettings: function () {
      return {
        type: "sap.ui.model.odata." + this.ODATA_VERSION + ".ODataModel",
        uri: this.BACKEND_URL,
        settings: {
          defaultBindingMode: "TwoWay",
          metadataUrlParams: { sap_theme: "sap_horizon" },
          json: true,
          timeout: this.REQUEST_TIMEOUT,
        },
      };
    },

    /**
     * Get JSON model settings (for mock data)
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
        console.log("=== Data Service Configuration ===");
        console.log("Backend Enabled:", this.isBackendEnabled());
        console.log("Backend URL:", this.BACKEND_URL);
        console.log("OData Version:", this.ODATA_VERSION);
        console.log("Auth Type:", this.AUTH_TYPE);
        console.log("Entity Sets:", this.ENTITY_SETS);
      }
    },
  };
});

