var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res) {
	res.render('register', { });
});

router.post('/register', function (req, res) {
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
	    if (!err) { 	
	        return res.render('register', { account : account });
	    }

	    passport.authenticate('local')(req, res, function () {
	    	res.redirect('/home');
	    });
	});
});

router.post('/register', function (req, res) {
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
	    if (!err) { 	
	        return res.render('register', { account : account });
	    }

	    passport.authenticate('local')(req, res, function () {
	    	res.redirect('/home');
	    });
	});
});

router.get('/login', function (req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
	res.redirect('/home')
});

router.get('/home', function (req, res) {
	res.render('home', {user : req.user});
});

module.exports = router;
