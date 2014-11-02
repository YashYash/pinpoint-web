var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Chat = require('../models/chat');
var Ad = require('../models/ads');
var Category = require('../models/category');
var async = require('async');
var ff = require('ff');
var geocoder = require('geocoder');
var moment = require('moment');

router.get('/user/find/:id', function(req,res) {
	f = ff(function() {
		Account.findOne({_id: req.params.id}).exec(f.slot());
	}, function(account) {
		res.send(account);
	});
});

router.get('/user/:id', function(req, res) {
	f = ff(function() {
		Account.findOne({_id: req.params.id}).populate('chats').exec(f.slot());
	}, function(account) {
		res.send(account.chats);
	});
});
router.get('/start/:from/:to', function(req, res) {
	f = ff(function() {
		Account.findOne({_id: req.params.from}).exec(f.slot());
	}, function(account) {
		console.log('from');
		if(account.chats.indexOf(req.params.to) > -1) {
			console.log('1. Convo already exists');
		} else {
			account.chats.push(req.params.to);
			account.save();
			console.log(account);
		}
		
	}, function() {
		var g = ff(function() {
			Account.findOne({_id: req.params.to}).exec(g.slot());
		}, function(account) {
			console.log('to');
			if(account.chats.indexOf(req.params.from) > -1) {
				console.log('2. Convo already exists');
			} else {
				account.chats.push(req.params.from);
				console.log(account);
				account.save();
				socket.emit('chats update', account);
			}			
			res.send('Starting chat between ' + req.params.from + ' and ' + req.params.to);
		});
	});
});

router.post('/new/message', function(req, res) {
	console.log(req.body);
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
	var allmessages = [];
	f = ff(function() {
		Chat.find({
			shortname: req.params.userid + req.params.sellerid
		}).exec(f.slot());
	}, function(setone) {
		if(setone) {
			async.eachSeries(setone, function(message, cb) {
				allmessages.push(message);
				cb();
			}, function() {
				g = ff(function() {
					Chat.find({
						shortname: req.params.sellerid + req.params.userid
					}).exec(g.slot());
				}, function(settwo) {
					if(settwo) {
						async.eachSeries(settwo, function(message, cb2) {
							allmessages.push(message);
							cb2();
						}, function() {
							res.send(allmessages);
						});						
					}
				});
			});
		} else {
			console.log('unble to find set one');
		}
	});
});
module.exports = router;