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
var phantom = require('phantomjs');

router.post('/', function(req, res) {
  console.log('#### In the kijiji post api');
  console.log(req.body);
});


module.exports = router;
