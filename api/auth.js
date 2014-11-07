'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var async = require('async');
var ff = require('ff');

router.post('/register', function(req, res) {
  console.log(req.body);
  var account = new Account({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  account.save(function(err) {
    if(err) {
      console.log('err ' + err);
    } else {
      res.send(account);
    }
  });
});

router.post('/login', function(req, res) {
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({username : req.body.username}).exec(f.slot());
  }, function(account) {
    if(!account) {
      console.log('In correct username');
      var error = {
        message: 'Incorrect Username',
      };
      res.send(error);
    } else {
      console.log('username exists');
      console.log(account);
      account.comparePassword(req.body.password, function(err, isMatch) {
        if(err) {
          console.log(err);
        } else {
          console.log(isMatch);
          if(!isMatch) {
            console.log('Its not a match');
            var error = {
              message: 'Incorrect Password',
            };            
            res.send(error);
          } else {
            console.log('Its a match!!');
            var success = {
              message: 'Authenticated',
              user: account
            };
            res.send(success);
          }
        }
      });
    }
  });
});

module.exports = router;
