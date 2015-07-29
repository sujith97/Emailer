var express = require('express'),
	router = express.Router(),
	authProvider = require('../services/gmail-auth-provider'),
	messageList = require('../services/email-list'),
	messageMessage = require('../services/email-message');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render("index.html");
});

/* GET all email IDs. */
router.get('/email', function(req, res, next) {
  authProvider.authenticate().then(function(auth) {
		messageList.allUnread(auth).then(function(response) {
			res.json(response);
		});
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
