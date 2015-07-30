(function() {
    angular.module("offmailer")
    .factory("authInterceptor", SessionInterseptor)
    .config(HttpConfig);

    SessionInterseptor.$inject = ["$window"];
    function SessionInterseptor($window) {
      var service = {
          request: handleRequest
      };
      return service;

      function handleRequest(config) {
        var token = $window.localStorage['accessToken'];
        if (token) {
            config.headers['session-token'] = token;
        } else {
          config.headers['session-token'] = "JUNKI";
        }
        return config;
      }
    };

    HttpConfig.$inject = ["$httpProvider"];
    function HttpConfig($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    };

})();