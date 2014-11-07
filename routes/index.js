var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var async = require('async');
var ff = require('ff');

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

// Register
router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res) {
  console.log(req.body);
  var account = new Account({
    username: req.body.username,
    password: req.body.password
  });
  account.save(function(err) {
    if(err) {
      console.log('err ' + err);
    } else {
      res.render('register');
    }
  });
});

// Login
router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/home');
});


router.get('/home', function(req, res) {
  res.render('home', {
    user: req.user
  });
});

module.exports = router;
