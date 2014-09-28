var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');

router.get('/test', function (req, res) {
	res.send({name: "hello"});
})

router.post('/test', function (req, res) {
	res.send({name: "hello"});
})

/// ALL ACCOUNTS ///
router.get('/accounts', function (req, res) {
	var Account = mongoose.model('Account', Account);
	return Account.find(function(err, accounts){
		if(!err) {
			return res.send(accounts);
		} else {
			return console.log(err);
		}
	})
})

module.exports = router;