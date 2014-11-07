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

router.get('/', function(req, res) {
  var f = ff(function() {
    Category.find().sort({
      name: 1
    }).exec(f.slotMulti());
  }, function(categories, err) {
    if(!err) {
      res.send(categories);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);
    }
  });
});

router.get('/urls', function(req, res) {
  var f = ff(function() {
    Category.find().populate('urls').sort({
      name: 1
    }).exec(f.slotMulti());
  }, function(categories, err) {
    if(!err) {
      res.send(categories);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);
    }
  });
});

router.get('/ads', function(req, res) {
  var f = ff(function() {
    Category.find().populate('ads').sort({
      name: 1
    }).exec(f.slotMulti());
  }, function(categories, err) {
    if(!err) {
      res.send(categories);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/:id', function(req, res) {
  var f = ff(function() {
    Category.findOne({
      _id: req.params.id
    }).exec(f.slotMulti());
  }, function(category, err) {
    if(!err) {
      res.send(category);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);        
    }
    
  });
});

module.exports = router;
