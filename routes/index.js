var express = require('express');
var router = express.Router();
var emailService = require('../services/email');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sujith' });
});

module.exports = router;
