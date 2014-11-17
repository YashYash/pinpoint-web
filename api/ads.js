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
    Ad.find().sort({
      created: 1
    }).exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);       
    }
    
  });
});

router.get('/:id', function(req, res) {
  var f = ff(function() {
    Ad.findOne({
      _id: req.params.id
    }).populate('category').exec(f.slotMulti());
  }, function(ad, err) {
    if(!err) {
      res.send(ad);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);       
    }
    
  });
});

router.get('/location/:lng/:lat', function(req, res) {
  var f = ff(function() {
    Ad.find({
      geo: {
        '$near': [req.params.lng, req.params.lat]
      }
    }).sort().populate('user').exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);       
    }
    
  });
});

router.get('/category/location/:id/:lng/:lat', function(req, res) {
  var f = ff(function() {
    Ad.find({
      category: req.params.id,
      geo: {
        '$near': [req.params.lng, req.params.lat]
      }
    }).exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/category', function(req, res) {
  var f = ff(function() {
    Ad.find().populate('category').sort().exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);
    }
  });
});

router.get('/zone/:zone', function(req, res) {
  var f = ff(function() {
    Ad.find({
      zone: req.params.zone
    }).sort().exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

router.get('/:zone/:category', function(req, res) {
  var data = [];
  if (req.params.zone === 'all') {
    var f = ff(function() {
      Ad.find({
        category: req.params.category
      }).sort().exec(f.slotMulti());
    }, function(ads, err) {
      if(!err) {
        res.send(ads);
      } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);         
      }
    });
  } else {
    var g = ff(function() {
      Ad.find({
        zone: req.params.zone,
        category: req.params.category
      }).sort().exec(g.slotMulti());
    }, function(ads, err) {
      if(!err) {
        res.send(ads);  
      } else{
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);         
      }
    });
  }
});

router.get('/user/:user', function(req,res) {
  var f = ff(function() {
    Ad.find({user: req.params.user}).exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);       
    }
  });
});

router.get('/all/user/:user', function(req,res) {
  var f = ff(function() {
    Ad.find({user: req.params.user}).exec(f.slotMulti());
  }, function(ads, err) {
    if(!err) {
      res.send(ads);  
    } else {
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);       
    }
  });
});

// Post ads
router.post('/new', function(req, res) {
  var ad;
  console.log(req.body);
  var shortname = req.body.title.replace(/\s/g, '').toLowerCase();
  var f = ff(function() {
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
      source: 'user',
      petfriendly: req.body.petfriendly,
      furnished: req.body.furnished,
      bathrooms: req.body.bathrooms,
      rentby: req.body.rentby,
      size: req.body.size,
      tags: req.body.tags,
      user: req.body.user,
      geo: req.body.geo,
      category: req.body.category
    });
    ad.save();
    socket.emit('new ad', ad);
    res.send(ad);
  });
});

router.post('/delete', function(req,res) {
  console.log('#### Deleting ad');
  console.log(req.body);
  var f = ff(function() {
    Ad.remove({_id: req.body._id}, function() {
      console.log('#### Ad has been deleted');
      res.send('deleted successfully');      
    });
  });
});
module.exports = router;
