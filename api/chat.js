var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Ad = require('../models/ads');
var Category = require('../models/category');
var async = require('async');
var ff = require('ff');
var geocoder = require('geocoder');


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

router.post('/chat/new/:from/:to', function(req, res) {

    res.send("message from ");

});

module.exports = router;