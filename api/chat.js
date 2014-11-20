'use strict';
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Chat = require('../models/chat');
var async = require('async');
var ff = require('ff');

router.get('/user/find/:id', function(req, res) {
  var f = ff(function() {
    Account.findOne({
      _id: req.params.id
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      res.send(account);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);
    }

  });
});

router.get('/user/:id', function(req, res) {
  var f = ff(function() {
    Account.findOne({
      _id: req.params.id
    }).populate('chats').exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      res.send(account.chats);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);
    }

  });
});

router.get('/start/:from/:to', function(req, res) {
  var f = ff(function() {
    Account.findOne({
      _id: req.params.from
    }).exec(f.slotMulti(2));
  }, function(account, err) {
    if (!err) {
      console.log('#### From');
      if (account.chats.indexOf(req.params.to) > -1) {
        console.log('#### Convo Already Exists');
      } else {
        console.log('#### Convo is does not exist');
        console.log('#### Adding sellers id to user chats array');
        account.chats.push(req.params.to);
        account.save();
        console.log('#### THE FROM ACCOUNT ####');
        console.log(account);
        console.log('###########################');
      }
    } else {
      console.log('#### Error in first get call');
      console.log('#### Err: ' + err);
    }
  }, function() {
    var g = ff(function() {
      Account.findOne({
        _id: req.params.to
      }).exec(g.slotMulti(2));
    }, function(account, err) {
      if (!err) {
        console.log('#### To');
        if (account.chats.indexOf(req.params.from) > -1) {
          console.log('#### Convo already exists');
        } else {
          console.log('#### Convo is does not exist');
          console.log('#### Adding sellers id to user chats array');
          account.chats.push(req.params.from);
          account.save();
          console.log('#### THE TO ACCOUNT ####');
          console.log(account);
          console.log('#########################');
          console.log('#### The Chat Has Been Initiated. Socket Emitting Chat Updated');
          socket.emit('chats update', account);
          res.send('Starting chat between ' + req.params.from + ' and ' + req.params.to);
        }
      } else {
        console.log('#### Error in second get call');
        console.log('#### Err: ' + err);
      }
    });
  });
});

router.post('/new/message', function(req, res) {
  var chat = new Chat({
    username: req.body.username,
    shortname: req.body.userid + req.body.seller,
    message: req.body.message
  });
  chat.save(function(response) {
    console.log('saved');
    console.log(response);
    socket.emit('update messages', chat);
    res.send(chat);
  });

});

router.get('/convo/:userid/:sellerid', function(req, res) {
  console.log('#### Getting the existing conversation');
  var allmessages = [];
  var f = ff(function() {
    console.log('#### Getting first set of messages. userid + sellerid');
    Chat.find({
      shortname: req.params.userid + req.params.sellerid
    }).exec(f.slotMulti(2));
  }, function(setone, err) {
    if (!err) {
      if (setone.length > 0) {
        async.eachSeries(setone, function(message, cb) {
          allmessages.push(message);
          cb();
        }, function() {
          console.log('#### Getting Second set of messages. sellerid + userid');
          var g = ff(function() {
            Chat.find({
              shortname: req.params.sellerid + req.params.userid
            }).exec(g.slotMulti(2));
          }, function(settwo, err) {
            if (!err) {
              if (settwo.length > 0) {
                async.eachSeries(settwo, function(message, cb2) {
                  allmessages.push(message);
                  cb2();
                }, function() {
                  res.send(allmessages);
                });
              } else {
                console.log('#### Setwo has no messages in it');
                res.send(allmessages);
              }
            } else {
              console.log('#### Error getting second set');
              console.log('#### Err: ' + err);
            }
          });
        });
      } else {
        console.log('#### Setone has no messages in it');
      }
    } else {
      console.log('#### Error getting first set');
      console.log('#### Err: ' + err);
    }
  });
});

router.post('/typing', function(req, res) {
  console.log(req.body);
  console.log('#### Going to emit some shit using socket io right now');
  var status = 'this will tell you who is typing';
  var unique = 'message ' + req.body.user + req.body.seller;
  console.log(unique);
  if (req.body.what === 'show') {
    socket.emit(unique, 'show');
    res.send(status);
  }
  if (req.body.what === 'hide') {
    socket.emit(unique, 'hide');
    res.send(status);
  }
});

module.exports = router;
