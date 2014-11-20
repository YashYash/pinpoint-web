'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var async = require('async');
var ff = require('ff');

router.post('/register', function(req, res) {
  if ($scope.username)
    console.log(req.body);
  var account = new Account({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  account.save(function(err) {
    if (err) {
      console.log('err ' + err);
    } else {
      res.send(account);
    }
  });
});

router.post('/login', function(req, res) {
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({
      username: req.body.username
    }).exec(f.slot());
  }, function(account) {
    if (!account) {
      console.log('#### Incorrect Username');
      var error = {
        message: 'Incorrect Username',
      };
      res.send(error);
    } else {
      console.log('##### Account exits: ');
      console.log(account);
      account.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          console.log(err);
        } else {
          console.log(isMatch);
          if (!isMatch) {
            console.log('#### Passwords do not match');
            var error = {
              message: 'Incorrect Password',
            };
            res.send(error);
          } else {
            console.log('#### Passwords Match');
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

router.post('/check-username', function(req, res) {
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({
      username: req.body.username
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      if (account) {
        console.log('#### Found the account');
        console.log(account);
        res.send('Not Available');
      } else {
        res.send('Username Available');
      }
    } else {
      res.send('#### An error occured: ' + err);
    }
  });
});

router.post('/edit', function(req, res) {
  console.log('#### Changing the username and email');
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({
      _id: req.body.id
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      if (account) {
        console.log('#### Found the account. Updating the username and email');
        account.username = req.body.username;
        account.email = req.body.email;
        account.save(f.wait());
        var message = {
          status: 'Username and email have been updated',
          account: account
        };
        res.send(message);
      } else {
        console.log('#### Unable to find any account with this id: ' + req.body.id);
      }
    } else {
      console.log('#### An error occured in the username post call');
      console.log('### Err: ' + err);
    }
  });
});

router.post('/change-password', function(req, res) {
  console.log('#### Changing the password');
  var f = ff(function() {
    Account.findOne({
      _id: req.body.id
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      if (account) {
        account.comparePassword(req.body.currpassword, function(err, isMatch) {
          if (err) {
            console.log('#### An error occured while authenticating the password: ' + err);
          } else {
            console.log(isMatch);
            if (!isMatch) {
              console.log('#### Passwords do not match');
              var error = {
                message: 'Incorrect Password',
              };
              res.send(error);
            } else {
              console.log('#### Passwords match. Updating the password');
              account.password = req.body.newpassword;
              account.save();
              var success = {
                message: 'Passwords changed',
                user: account
              };
              res.send(success);
            }
          }
        });
        console.log('#### Passwords have been updated');
      } else {
        console.log('#### Unable to find any account with this id: ' + req.body.id);
      }
    } else {
      console.log('#### An error occured in the password change post call');
      console.log('### Err: ' + err);
    }
  });
});

router.post('/current-location', function(req, res) {
  console.log('#### Updating the user\'s current location');
  console.log(req.body);
  var f = ff(function() {
    Account.findOne({
      _id: req.body.id
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      if (account) {
        console.log('#### Found Account');
        account.geo = [req.body.lng, req.body.lat];
        account.lat = req.body.lat;
        account.lng = req.body.lng;
        console.log(account);
        account.save();
        console.log('#### Geo Location has been updated');
        res.send('User Location Updated');
      } else {
        console.log('#### Unable to find an account with that id: ' + req.body.id);
      }
    } else {
      console.log('#### An error occured setting the user\'s location');
    }
  });
});
module.exports = router;
