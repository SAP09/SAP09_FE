sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "odata/metadata/manager/model/DataService",
    "odata/metadata/manager/model/Config",
    "odata/metadata/manager/model/SAPLoginService",
  ],
  function (UIComponent, JSONModel, DataService, Config, SAPLoginService) {
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

        // Intercept initialization for per-user authentication
        if (Config.isBackendEnabled() && Config.AUTH_TYPE === "basic-per-user") {
          if (SAPLoginService.isLoggedIn()) {
            this._completeInitialization();
          } else {
            this._showLoginDialog();
          }
        } else {
          this._completeInitialization();
        }
      },

      _completeInitialization: function () {
        // Create data service (factory pattern)
        var oDataService = DataService.createDataService(this);
        this._oDataService = oDataService;

        // Initialize model with data
        this._initializeModel(oDataService, oDataService.getStatus ? oDataService.getStatus() : null);

        // Initialize the router
        this.getRouter().initialize();
      },

      _showLoginDialog: function () {
        var that = this;
        sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
          Fragment.load({
            id: that.createId("login"),
            name: "odata.metadata.manager.view.SAPLogin",
            controller: that
          }).then(function (oDialog) {
            that._oLoginDialog = oDialog;
            
            var oRoot = that.getRootControl();
            if (oRoot && oRoot.addDependent) {
              oRoot.addDependent(oDialog);
            } else {
              oDialog.setModel(that.getModel());
            }

            oDialog.setEscapeHandler(function (oPromise) {
              oPromise.reject();
            });
            oDialog.open();
          }).catch(function (oError) {
            console.error("[Component] Failed to load login dialog fragment:", oError);
          });
        });
      },

      onSAPLoginEscape: function (oPromise) {
        oPromise.reject();
      },

      onSAPLoginSubmit: function () {
        var that = this;
        var oDialog = this._oLoginDialog;
        var sUser = this.byId("login--sapUsernameInput").getValue();
        var sPassword = this.byId("login--sapPasswordInput").getValue();
        var oErrorStrip = this.byId("login--sapLoginErrorStrip");
        var oSubmitBtn = this.byId("login--sapLoginSubmitBtn");

        if (!sUser || !sPassword) {
          oErrorStrip.setText("Please enter both username and password.");
          oErrorStrip.setVisible(true);
          return;
        }

        oSubmitBtn.setEnabled(false);
        oErrorStrip.setVisible(false);

        var sAuth = "Basic " + btoa(unescape(encodeURIComponent(sUser + ":" + sPassword)));
        
        fetch(Config.BACKEND_URL, {
          method: "GET",
          headers: {
            "Authorization": sAuth,
            "sap-client": Config.SAP_CLIENT
          }
        }).then(function (response) {
          oSubmitBtn.setEnabled(true);
          if (response.status === 401) {
            oErrorStrip.setText("Invalid S/4HANA username or password.");
            oErrorStrip.setVisible(true);
          } else if (response.status === 403) {
            oErrorStrip.setText("Forbidden: You do not have permission to access S/4HANA.");
            oErrorStrip.setVisible(true);
          } else if (!response.ok) {
            oErrorStrip.setText("S/4HANA authentication failed (" + response.status + ")");
            oErrorStrip.setVisible(true);
          } else {
            // Credentials are valid
            SAPLoginService.login(sUser, sPassword);
            oDialog.close();
            oDialog.destroy();
            that._oLoginDialog = null;
            that._completeInitialization();
          }
        }).catch(function (error) {
          oSubmitBtn.setEnabled(true);
          oErrorStrip.setText("Connection failed: " + error.message);
          oErrorStrip.setVisible(true);
        });
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
              var oMergedData = Object.assign({
                sapUser: SAPLoginService.getUsername(),
                isBackend: Config.isBackendEnabled() && Config.AUTH_TYPE === "basic-per-user"
              }, oData);
              oModel.setData(oMergedData);
            }
            console.log(
              "[Component] Data service initialized:",
              oStatus ? oStatus.backend : "Mock Data"
            );
          },
          function (oError) {
            console.error("[Component] Failed to load data:", oError);
            // Fallback: empty model
            oModel.setData({
              sapUser: SAPLoginService.getUsername(),
              isBackend: Config.isBackendEnabled() && Config.AUTH_TYPE === "basic-per-user"
            });
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
