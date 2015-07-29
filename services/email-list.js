var google = require('googleapis'),
		q = require('q');

var listUnreadMessages = function() {
	var gmail = google.gmail('v1');

	var service = {
		allUnread: allUnread
	};

	return service;

	function allUnread(auth) {
		return queryEmails(auth, 'in:inbox -category:(promotions OR social OR forums) is:unread');
	}

	function queryEmails(auth, query) {
		var deferred = q.defer();
		gmail.users.messages.list({
			auth: auth,
			userId: 'me',
			q: query
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

module.exports = listUnreadMessages();