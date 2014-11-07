'use strict';
var express = require('express');
var router = express.Router();
var Zone = require('../models/zone');
var ff = require('ff');

router.get('/', function(req, res) {
  var f = ff(function() {
    Zone.find().sort().exec(f.slotMulti());
  }, function(zones, err) {
    if(!err) {
      res.send(zones);
    } else{
      console.log('#### Error in get call');
      console.log('#### Err: ' + err);      
    }
  });
});

module.exports = router;
