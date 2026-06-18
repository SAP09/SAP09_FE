sap.ui.define(
  ["odata/metadata/manager/model/mockData"],
  function (MockData) {
    "use strict";

    return {
      /**
       * Create a MockDataService instance
       * @returns {Object} Service object with read/create/update/delete methods
       */
      createInstance: function () {
        return {
          /**
           * Read initial data
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          read: function (fnSuccess, fnError) {
            try {
              var oData = MockData.getData();
              if (fnSuccess) {
                fnSuccess(oData);
              }
            } catch (ex) {
              if (fnError) {
                fnError(ex);
              }
            }
          },

          /**
           * Create a new entity (mock: just log)
           * @param {string} sEntitySet - Entity set name
           * @param {Object} oData - Entity data
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          create: function (sEntitySet, oData, fnSuccess, fnError) {
            console.log("[MockDataService] Creating entity in:", sEntitySet, oData);
            if (fnSuccess) {
              fnSuccess({ id: "mock_" + Date.now(), ...oData });
            }
          },

          /**
           * Update an entity (mock: just log)
           * @param {string} sEntitySet - Entity set name
           * @param {string} sKey - Entity key
           * @param {Object} oData - Updated data
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          update: function (sEntitySet, sKey, oData, fnSuccess, fnError) {
            console.log("[MockDataService] Updating entity in:", sEntitySet, sKey, oData);
            if (fnSuccess) {
              fnSuccess(oData);
            }
          },

          /**
           * Delete an entity (mock: just log)
           * @param {string} sEntitySet - Entity set name
           * @param {string} sKey - Entity key
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          delete: function (sEntitySet, sKey, fnSuccess, fnError) {
            console.log("[MockDataService] Deleting entity from:", sEntitySet, sKey);
            if (fnSuccess) {
              fnSuccess();
            }
          },

          /**
           * Query entities with filters
           * @param {string} sEntitySet - Entity set name
           * @param {Object} oFilters - Filter criteria
           * @param {Function} fnSuccess - Success callback
           * @param {Function} fnError - Error callback
           */
          query: function (sEntitySet, oFilters, fnSuccess, fnError) {
            console.log("[MockDataService] Querying:", sEntitySet, oFilters);
            var oData = MockData.getData();
            var aResults = oData[sEntitySet] || [];
            if (fnSuccess) {
              fnSuccess(aResults);
            }
          },

          /**
           * Check service status
           * @returns {Object} Status object
           */
          getStatus: function () {
            return {
              isOnline: true,
              isMock: true,
              backend: "Mock Data Service",
            };
          },
        };
      },
    };
  }
);

