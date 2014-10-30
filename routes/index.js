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

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res) {
  console.log(req.body)
  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (!err) {
      return res.render('register', {
        account: account
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/home');
    });
  });
});

router.post('/ionic/register', function(req, res) {
  console.log(req.body);
  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (!err) {
      var f = ff(function() {
        Account.findOne({
          username: req.body.username
        }).exec(f.slot());
      }, function(account) {
        account.email = req.body.email;
        account.type = req.body.type;
        account.loggedIn = req.body.loggedIn;
        console.log(account);
        account.save();
        res.send(account);
      });
    } else {
      console.log('an error occured');
      console.log(err);
      res.send(err.message);
    }
  });
});



router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/home');
});


router.post('/ionic/login', function(req, res, next) {
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({
      username: req.body.username
    }).exec(f.slot());
  }, function(account) {
    if (!account) {
      console.log('unable to find and account to log in');
      res.send('unable to find an account with that username');
    } else {
      console.log(account);
      res.send(account);
    }
  });
});

router.get('/home', function(req, res) {
  res.render('home', {
    user: req.user
  });
});

module.exports = router;
