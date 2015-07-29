var google = require('googleapis'),
		q = require('q');

var messageService = function() {
	var gmail = google.gmail('v1');

	var service = {
		getEmailById: getEmailById
	};
	return service;

	function getEmailById(auth, id) {
		var deferred = q.defer();
		gmail.users.messages.get({
			auth: auth,
			userId: 'me',
			id: id
		}, function(err, response) {
			if (err) {
			  deferred.reject('The API returned an error: ' + err);
			} else {
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	}
};

module.exports = messageService();