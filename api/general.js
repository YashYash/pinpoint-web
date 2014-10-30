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

// CATEGORIES

router.get('/categories', function(req, res) {
  f = ff(function() {
    Category.find().sort({
      name: 1
    }).exec(f.slot());
  }, function(categories) {
    res.send(categories);
  });
});

router.get('/categories/urls', function(req, res) {
  f = ff(function() {
    Category.find().populate('urls').sort({
      name: 1
    }).exec(f.slot());
  }, function(categories) {
    res.send(categories);
  });
});

router.get('/categories/ads', function(req, res) {
  f = ff(function() {
    Category.find().populate('ads').sort({
      name: 1
    }).exec(f.slot());
  }, function(categories) {
    res.send(categories);
  });
});

router.get('/category/:id', function(req, res) {
  f = ff(function() {
    Category.findOne({
      _id: req.params.id
    }).exec(f.slot());
  }, function(category) {
    res.send(category);
  });
});


// Ads

router.get('/ads', function(req, res) {
  f = ff(function() {
    Ad.find().sort({
      created: 1
    }).exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/ads/:id', function(req, res) {
  f = ff(function() {
    Ad.findOne({
      _id: req.params.id
    }).exec(f.slot());
  }, function(ad) {
    res.send(ad);
  });
});

router.get('/ads/location/:lng/:lat', function(req, res) {
  f = ff(function() {
    Ad.find({
      geo: {
        '$near': [req.params.lng, req.params.lat]
      }
    }).sort().populate('user').exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/ads/category/location/:id/:lng/:lat', function(req, res) {
  f = ff(function() {
    Ad.find({
      category: req.params.id,
      geo: {
        '$near': [req.params.lng, req.params.lat]
      }
    }).exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/ads/category', function(req, res) {
  f = ff(function() {
    Ad.find().populate('category').sort().exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});


router.get('/ads/zone/:zone', function(req, res) {
  f = ff(function() {
    Ad.find({
      zone: req.params.zone
    }).sort().exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

router.get('/ads/:zone/:category', function(req, res) {
  var data = [];
  if (req.params.zone === 'all') {
    f = ff(function() {
      Ad.find({
        category: req.params.category
      }).sort().exec(f.slot());
    }, function(ads) {
      res.send(ads);
    });
  }
  if (req.params.zone !== 'all') {
    f = ff(function() {
      Ad.find({
        zone: req.params.zone,
        category: req.params.category
      }).sort().exec(f.slot());
    }, function(ads) {
      res.send(ads);
    });
  }
});

router.get('/user/ads/:user', function(req,res) {
  console.log('called!!'); 
  console.log("getting the user's ads ");
  var f = ff(function() {
    Ad.find({user: req.params.user}).exec(f.slot());
  }, function(ads) {
    res.send(ads);
  });
});

// Urls

router.get('/urls', function(req, res) {
  f = ff(function() {
    Url.find().sort().exec(f.slot());
  }, function(urls) {
    res.send(urls);
  });
});

router.get('/urls/category', function(req, res) {
  f = ff(function() {
    Url.find().sort().populate('category').lean().exec(f.slot());
  }, function(urls) {
    res.send(urls);
  });
});

router.get('/urls/zone', function(req, res) {
  f = ff(function() {
    Url.find().sort().populate('zone').lean().exec(f.slot());
  }, function(urls) {
    res.send(urls);
  });
});

router.get('/urls/:zone/:category', function(req, res) {
  console.log(req.params.zone);
  console.log(req.params.category);
  f = ff(function() {
    Url.find({
      zone: req.params.zone,
      category: req.params.category
    }).sort().exec(f.slot());
  }, function(urls) {
    res.send(urls);
  });
});

//ZONES

router.get('/zones', function(req, res) {
  f = ff(function() {
    Zone.find().sort().exec(f.slot());
  }, function(zones) {
    res.send(zones);
  });
});

module.exports = router;
