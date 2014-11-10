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
   phantom.create(function(ph) {
     ph.createPage(function(page) {
      console.log('opening page');
       page.open("http://www.google.com", function(status) {
         console.log("opened google? ", status);
         page.evaluate((function() {
           return document.title;
         }), function(result) {
           console.log('Page title is ' + result);
           ph.exit();
         });
       });
     });
   });  

});


module.exports = router;
