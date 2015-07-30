var express = require('express'),
	router = express.Router(),
	authProvider = require('../services/gmail-auth-provider'),
	messageList = require('../services/email-list'),
	messageMessage = require('../services/email-message');

/* GET home page. */
router.get('/', function(req, res, next) {
	authProvider.authenticate().then(function(auth) {
		res.render("index.html");
	});
});

router.get('/authenticate', function(req, res, next) {
	console.log('Code: ' + req.query.code);
	authProvider.generateAndSaveToken(req.query.code).then(function(auth) {
		res.redirect('/');
	});
});

/* GET all email IDs. */
router.get('/email', function(req, res, next) {
  authProvider.authenticate().then(function(auth) {
  	if (auth && auth.requiresLogin) {
  		res.json(auth);
  	} else {
  		messageList.allUnread(auth).then(function(response) {
				res.json(response);
			});
  	}
	});
});

router.get('/email/:id', function(req, res, next) {
	authProvider.authenticate().then(function(auth) {
		messageMessage.getEmailById(auth, req.params.id).then(function(response) {
			res.json(response);
		});
	});
});

module.exports = router;
