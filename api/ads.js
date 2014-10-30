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

router.get('/carsandtrucks', function(req, res) {
  f = ff(function() {
    Ad.find().exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/carsandtrucks/:lng/:lat', function(req, res) {
  f = ff(function() {
    Ad.find({
      geo: {
        '$near': [req.params.lng, req.params.lat]
      }
    }).exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/ads/:zone/:category/', function(req, res) {
  var data = [];
  f = ff(function() {
    Ad.find({
      zone: req.params.zone
    }).sort().exec(f.slot());
  }, function(ads) {
    res.send(ads);
    async.eachSeries(ads, function(ad, callback) {
      if (ad.category._id === req.params.category) {
        data.push(ad);
      }
    }, function() {
      res.send(data);
    });
  });
});

router.get('/user/:user', function(req,res) {
  console.log('called!!'); 
  console.log("getting the user's ads ");
  var f = ff(function() {
    Ad.find({user: req.params.user}).exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

// Post ads
router.post('/new', function(req, res) {
  var ad;
  console.log(req.body);
  var shortname = req.body.title.replace(/\s/g, '').toLowerCase();
  f = ff(function() {
    ad = new Ad({
      shortname: shortname,
      title: req.body.title,
      price: req.body.price,
      address: req.body.address,
      seller: req.body.seller,
      make: req.body.make,
      model: req.body.model,
      color: req.body.color,
      miles: req.body.miles,
      kilometers: req.body.kilometers,
      vehicletype: req.body.vehicletype,
      description: req.body.description,
      drive: req.body.drive,
      fuel: req.body.fuel,
      source: req.body.source,
      petfriendly: req.body.petfriendly,
      furnished: req.body.furnished,
      bathrooms: req.body.bathrooms,
      rentby: req.body.rentby,
      size: req.body.size,
      tags: req.body.tags,
      user: req.body.user,
      geo: req.body.geo
    });
    ad.save(f.wait);
    socket.emit('new ad', ad);
    res.send(ad);
  });
});

module.exports = router;
