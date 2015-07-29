(function() {
	angular.module("offmailer", ["ui.router", "ngSanitize", "home.controller"])
	.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	  
	  $stateProvider
	    .state('home', {
	      url: '/',
	      templateUrl: '/javascripts/partials/home.html',
	      controller: 'homeController',
	      controllerAs: 'homeCtrl'
	    });
	    $urlRouterProvider.otherwise('/');
	}])
	.run(["$rootScope", function($rootScope) {
		$rootScope.constants = {
			serverAddress : 'http://localhost:3000'
		}
	}])
	.controller('appController', ['$scope', function($scope) {
		
	}])

})();