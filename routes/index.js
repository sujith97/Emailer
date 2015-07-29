var express = require('express'),
	router = express.Router(),
	authProvider = require('../services/gmail-auth-provider'),
	messageList = require('../services/email-list'),
	messageMessage = require('../services/email-message');

/* GET home page. */
router.get('/', function(req, res, next) {
	authProvider.authenticate().then(function(auth) {
		messageList.allUnread(auth).then(function(response) {
			console.log(response);
			res.render('index', { title: "Sujith", messages: response });
		})
	});
  	
});

router.get('/message/:id', function(req, res, next) {
	authProvider.authenticate().then(function(auth) {
		messageMessage.getEmailById(auth, req.params.id).then(function(response) {
			console.log("Message: \n", response.snippet);
		});
	});
});

module.exports = router;
