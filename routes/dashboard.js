var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var ff = require('ff');
var bCrypt = require('bCrypt');

router.get('/', function (req, res) {
	console.log(globalEnv);
  console.log(req.user);
  var data;
  if(req.user) {
    data = {
      environment: globalEnv,
      user: req.user,
      loggedIn: 'true'
    };
  } else {
    data = {
      environment: globalEnv,
      user: {
        username: ''
      },
      loggedIn:'false'
    };    
  }
	console.log(req.user);
	res.render('dashboard', data);
});

module.exports = router;					