'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Url = require('../models/url');
var Category = require('../models/category');
var Ad = require('../models/ads');
var Zone = require('../models/zone');
var async = require('async');
var ff = require('ff');

router.get('/', function(req, res) {
  var f = ff(function() {
    Url.find().sort().exec(f.slotMulti());
  }, function(urls, err) {
    if(!err) {
      res.send(urls);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/category', function(req, res) {
  var f = ff(function() {
    Url.find().sort().populate('category').lean().exec(f.slotMulti());
  }, function(urls, err) {
    if(!err) {
      res.send(urls);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/zone', function(req, res) {
  var f = ff(function() {
    Url.find().sort().populate('zone').lean().exec(f.slotMulti());
  }, function(urls, err) {
    if(!err) {
      res.send(urls);
    } else{
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/:zone/:category', function(req, res) {
  console.log(req.params.zone);
  console.log(req.params.category);
  var f = ff(function() {
    Url.find({
      zone: req.params.zone,
      category: req.params.category
    }).sort().exec(f.slotMulti());
  }, function(urls, err) {
    if(!err) {
      res.send(urls);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

module.exports = router;