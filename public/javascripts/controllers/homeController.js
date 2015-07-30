(function() {
	angular.module("home.controller", ["home.service"])
	.controller("homeController", HomeController);

	HomeController.$inject = ["$state", "homeService", "$location", "$window"];
	function HomeController($state, homeService, $location, $window) {
		var vm = this;
		vm.messages = [];
		homeService.getAllEmailIds().then(function(response) {
			if (response && response.messages && Array.isArray(response.messages)) {
				response.messages.forEach(function(message, index){
					homeService.getEmailById(message.id).then(function(emailMessage) {
						if (emailMessage) {
							vm.messages.push(constructMessage(emailMessage));
						}
					});
				});
			} else if(response && response.requiresLogin) {
				$window.location = response.requiresLogin;
			}
		});

		var divContent = document.getElementById("contentMessage");
		vm.displayMessage = function(message) {
			divContent.innerHTML = message.body;
		}

		var constructMessage = function (message) {
			var customMessage = {
				snippet: message.snippet
			};
			message.payload.headers.forEach( function(header) {
				if (header.name === "Subject") {
					customMessage.subject = header.value;
				} else if (header.name === "From") {
					customMessage.from = header.value;
				} else if (header.name === "Date") {
					customMessage.date = new Date(header.value);
				} else if(message.payload.mimeType.indexOf("text/html") > -1 ) {
					customMessage.body = Base64.decode(message.payload.body.data);
				} else if (header.name === "Content-Type") {
					customMessage.body = Base64.decode(selectHtml(message.payload.parts).body.data);
				}
			});
			return customMessage;
		};

		var selectHtml = function(parts) {
			if (parts) {
				for (var i = 0; i < parts.length; i++) {
					if (parts[i].mimeType.indexOf("text/html") > -1 ) {
						return parts[i];
					} else {
						var selectedPart = selectHtml(parts[i].parts);
						if (selectedPart) {
							return selectedPart;
						}
					}
				} 
			} else {
				return false;
			}
		};

	};

})();