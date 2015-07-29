(function() {
	angular.module("home.service", [])
	.factory("homeService", HomeService);

	HomeService.$inject = ["$http", "$rootScope"];
	function HomeService($http, $rootScope) {
		var service = {
			getAllEmailIds: getAllEmailIds,
			getEmailById: getEmailById
		};
		return service;

		function getAllEmailIds() {
			return $http.get("/email").then(function(data) {
				return data.data;
			});
		}

		function getEmailById(emailId) {
			return $http.get("/email/" + emailId).then(function(data) {
				return data.data;
			});
		}
	}
})();