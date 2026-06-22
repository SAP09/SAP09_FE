sap.ui.define([], function () {
  "use strict";

  var SESSION_KEY = "sap_auth";
  var USER_KEY = "sap_user";

  return {
    /**
     * Store basic auth credentials in sessionStorage
     * @param {string} sUser - S/4HANA Username
     * @param {string} sPassword - S/4HANA Password
     */
    login: function (sUser, sPassword) {
      if (!sUser || !sPassword) {
        return;
      }
      var sCredentials = sUser + ":" + sPassword;
      // encode credentials using btoa
      var sEncoded = btoa(unescape(encodeURIComponent(sCredentials)));
      sessionStorage.setItem(SESSION_KEY, sEncoded);
      sessionStorage.setItem(USER_KEY, sUser);
    },

    /**
     * Clear credentials from sessionStorage
     */
    logout: function () {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(USER_KEY);
    },

    /**
     * Get the Authorization header value
     * @returns {string} Basic auth header value, or empty string if not logged in
     */
    getAuthHeader: function () {
      var sEncoded = sessionStorage.getItem(SESSION_KEY);
      return sEncoded ? "Basic " + sEncoded : "";
    },

    /**
     * Check if user is logged in (has credentials in sessionStorage)
     * @returns {boolean}
     */
    isLoggedIn: function () {
      return !!sessionStorage.getItem(SESSION_KEY);
    },

    /**
     * Get logged-in username
     * @returns {string}
     */
    getUsername: function () {
      return sessionStorage.getItem(USER_KEY) || "";
    }
  };
});
