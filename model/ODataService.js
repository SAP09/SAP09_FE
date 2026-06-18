sap.ui.define(
  ["sap/ui/model/odata/v2/ODataModel", "sap/ui/model/odata/v4/ODataModel", "odata/metadata/manager/model/Config"],
  function (ODataModelV2, ODataModelV4, Config) {
    "use strict";

    return {
      /**
       * Create an ODataService instance
       * @param {sap.ui.core.UIComponent} oComponent - Component reference
       * @returns {Object} Service object with read/create/update/delete methods
       */
      createInstance: function (oComponent) {
        var sODataVersion = Config.ODATA_VERSION;
        var sBackendUrl = Config.BACKEND_URL;

        // Determine OData model class
        var ODataModelClass = sODataVersion === "v4" ? ODataModelV4 : ODataModelV2;

        // Model initialization settings
        var oModelSettings = {
          defaultBindingMode: "TwoWay",
          metadataUrlParams: { sap_theme: "sap_horizon" },
          json: true,
          timeout: Config.REQUEST_TIMEOUT,
        };

        // Create OData model (to be attached to component)
        var oModel = new ODataModelClass(sBackendUrl, oModelSettings);

        return {
          /**
           * Read initial data via OData
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          read: function (fnSuccess, fnError) {
            // For OData, data is fetched via model binding
            // This callback ensures data is ready
            oModel.attachMetadataLoaded(function () {
              if (fnSuccess) {
                fnSuccess();
              }
            });

            oModel.attachMetadataFailed(function (oEvent) {
              if (fnError) {
                fnError(oEvent);
              }
            });
          },

          /**
           * Create a new entity via OData
           * @param {string} sEntitySet - Entity set name
           * @param {Object} oData - Entity data
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          create: function (sEntitySet, oData, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet);

            oModel.create(sPath, oData, {
              success: fnSuccess,
              error: fnError,
              async: true,
            });
          },

          /**
           * Update an entity via OData
           * @param {string} sEntitySet - Entity set name
           * @param {string} sKey - Entity key
           * @param {Object} oData - Updated data
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          update: function (sEntitySet, sKey, oData, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet) + "(" + sKey + ")";

            oModel.update(sPath, oData, {
              success: fnSuccess,
              error: fnError,
              async: true,
            });
          },

          /**
           * Delete an entity via OData
           * @param {string} sEntitySet - Entity set name
           * @param {string} sKey - Entity key
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          delete: function (sEntitySet, sKey, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet) + "(" + sKey + ")";

            oModel.remove(sPath, {
              success: fnSuccess,
              error: fnError,
              async: true,
            });
          },

          /**
           * Query entities with filters via OData
           * @param {string} sEntitySet - Entity set name
           * @param {Object} oFilters - Filter criteria
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          query: function (sEntitySet, oFilters, fnSuccess, fnError) {
            var sPath = "/" + Config.getEntitySet(sEntitySet);
            var oRequest = {
              urlParameters: oFilters,
              async: true,
            };

            oModel.read(sPath, {
              ...oRequest,
              success: function (oData) {
                if (fnSuccess) {
                  fnSuccess(oData.results || oData);
                }
              },
              error: fnError,
            });
          },

          /**
           * Get the underlying OData model
           * @returns {Object} ODataModel instance
           */
          getModel: function () {
            return oModel;
          },

          /**
           * Check service status
           * @returns {Object} Status object
           */
          getStatus: function () {
            return {
              isOnline: true,
              isMock: false,
              backend: sBackendUrl,
              odataVersion: sODataVersion,
            };
          },
        };
      },
    };
  }
);

