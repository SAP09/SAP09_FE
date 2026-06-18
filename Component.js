sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "odata/metadata/manager/model/DataService",
    "odata/metadata/manager/model/Config",
  ],
  function (UIComponent, JSONModel, DataService, Config) {
    "use strict";

    return UIComponent.extend("odata.metadata.manager.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        // Call super init first
        UIComponent.prototype.init.apply(this, arguments);

        // Log configuration (if debug mode enabled)
        Config.logConfiguration();

        // Create data service (factory pattern)
        var oDataService = DataService.createDataService(this);
        this._oDataService = oDataService;

        // Initialize model with data
        this._initializeModel(oDataService, oDataService.getStatus ? oDataService.getStatus() : null);

        // Initialize the router
        this.getRouter().initialize();
      },

      /**
       * Initialize the main JSON model
       * @param {Object} oDataService - Data service instance
       * @param {Object} oStatus - Service status
       * @private
       */
      _initializeModel: function (oDataService, oStatus) {
        var oModel = new JSONModel();
        this.setModel(oModel);

        // Load data from service
        oDataService.read(
          function (oData) {
            // Update model with data from service
            if (oData) {
              oModel.setData(oData);
            }
            console.log(
              "[Component] Data service initialized:",
              oStatus ? oStatus.backend : "Mock Data"
            );
          },
          function (oError) {
            console.error("[Component] Failed to load data:", oError);
            // Fallback: empty model
            oModel.setData({});
          }
        );
      },

      /**
       * Get data service instance
       * @returns {Object} Data service reference
       */
      getDataService: function () {
        return this._oDataService;
      },

      destroy: function () {
        UIComponent.prototype.destroy.apply(this, arguments);
      },
    });
  },
);
