var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Url = require('../models/url')
var async = require('async');
var ff = require('ff');

router.get('/zones', function (req, res) {
	f = ff(function() {
		Url.findOne({_id: "5432917a2e258900006507c6"}).exec(f.slot())
	}, function(url) {
		res.send(url.zones);
	})
})


router.get('/types', function (req, res) {
	f = ff(function() {
		Url.findOne({_id: "5432917a2e258900006507c6"}).exec(f.slot())
	}, function(url) {
		res.send(url.types);
	})
})

router.get('/categories', function (req, res) {
	var automobiles = [];
	var realestate = [];
	var pets = [];
	var services = [];
	var technology = [];
	var furniture = [];
	var community = [];
	var clothing = [];
	var jewlry = [];
	var tickets = [];
	f = ff(function() {
		Url.findOne({_id: "5432917a2e258900006507c6"}).exec(f.slot())
	}, function(url) {
		async.eachSeries(url.categories, function(category, cb) {
			if(category.category === 'Automobiles') {
				automobiles.push(category)
			}
			if(category.category === 'Real Estate') {
				realestate.push(category)
			}	
			if(category.category === 'Pets') {
				pets.push(category)
			}
			if(category.category === 'Services') {
				services.push(category)
			}	
			if(category.category === 'Technology') {
				technology.push(category)
			}	
			if(category.category === 'Furniture') {
				furniture.push(category)
			}		
			if(category.category === 'Community') {
				community.push(category)
			}	
			if(category.category === 'Jewlry') {
				jewlry.push(category)
			}	
			if(category.category === 'Tickets') {
				tickets.push(category)
			}																									
			cb()
		}, function() {
			var data = {
				  Automobiles: {
				  	array: automobiles,
				  	name:"Automobiles"
				  }
				, Realestate: {
					array: realestate,
					name: "Real Estate"
				}
				, Services: {
					array: services,
					name: "Services"
				}
				, Pets: {
					array: pets,
					name: "Pets"
				}
				, Furniture: {
					array: furniture,
					name: "Furniture"
				}
				, Community: {
					array: community,
					name: "Community"
				}
				, Jewlry: {
					array: jewlry,
					name: "Jewlry"
				}
				, Tickets: {
					array: tickets,
					name: "Tickets"
				}
			}
			res.send(data);
		})
	})
})


module.exports = router;