sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "odata/metadata/manager/model/mockData",
  ],
  function (UIComponent, JSONModel, MockData) {
    "use strict";

    return UIComponent.extend("odata.metadata.manager.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        // Call super init first
        UIComponent.prototype.init.apply(this, arguments);

        // Set up the main JSON model with mock data
        var oModel = new JSONModel(MockData.getData());
        this.setModel(oModel);

        // Initialize the router
        this.getRouter().initialize();
      },

      destroy: function () {
        UIComponent.prototype.destroy.apply(this, arguments);
      },
    });
  },
);
