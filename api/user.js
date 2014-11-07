'use strict';
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

router.get('/wishlist/:id', function(req, res) {
	var f = ff(function() {
		Account.findOne({_id: req.params.id}).populate('wishlist').exec(f.slotMulti(2));
	}, function(account, err) {
		if(!err) {
			res.send(account.wishlist);
		} else {
			console.log('#### An error occured in the get call');
			console.log('err: ' + err);
		}
	});
});

router.post('/wishlist/add', function(req, res) {
	var f = ff(function() {
		Account.findOne({_id: req.body.id}).exec(f.slotMulti(2));
	}, function(account,err) {
		if(!err) {
			if(account.wishlist.indexOf(req.body.ad._id) > -1) {
				console.log('#### Already in the list. Cannot add same ad multiple times');
			} else {
				account.wishlist.push(req.body.ad._id);
				account.save();
				console.log('#### Ad id added to wish list');
				res.send('Successfully added ad to users wishlist');				
			}
		} else {
			console.log('#### An error occured in the post call');
			console.log('err: ' + err);
		}
	});
});
module.exports = router;
