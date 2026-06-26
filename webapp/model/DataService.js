sap.ui.define(
  [
    "odata/metadata/manager/model/MockDataService",
    "odata/metadata/manager/model/ODataService",
    "odata/metadata/manager/model/Config",
  ],
  function (MockDataService, ODataService, Config) {
    "use strict";

    return {
      /**
       * Factory function to create appropriate data service based on configuration
       * @param {sap.ui.core.UIComponent} oComponent - Reference to component for model access
       * @returns {Object} DataService instance (MockDataService or ODataService)
       */
      createDataService: function (oComponent) {
        var bUseBackend = Config.isBackendEnabled();

        if (bUseBackend) {
          return ODataService.createInstance(oComponent);
        } else {
          return MockDataService.createInstance();
        }
      },

      /**
       * Get configuration helper
       * @returns {Object} Config module reference
       */
      getConfig: function () {
        return Config;
      },
    };
  }
);

