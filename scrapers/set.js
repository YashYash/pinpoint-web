var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Category = require('../models/category');
var Url = require('../models/url');
var Zone = require('../models/zone');
var async = require('async');
var ff = require('ff');

var zones = ["ontario", "quebec", "british-columbia", "alberta", "manitoba", "new-brunswick", "newfoundland", "nova-scotia", "prince-edward-island", "saskatchewan", "territories"];
var categories = [
  "Automobiles",
  "Real Estate",
  "Pets",
  "Services",
  "Technology",
  "Furniture",
  "Jewlry",
  "Tickets",
  "Clothing",
  "Volunteers",
  "Community"
]

var urls = [{
  code: "c174l9004",
  name: "b-cars-trucks",
  category: "Automobiles",
  zone: "ontario"
}, {
  code: "c122l9004",
  name: "b-classic-cars",
  category: "Automobiles",
  zone: "ontario"
}, {
  code: "c30l9004",
  name: "b-motorcycles",
  category: "Automobiles",
  zone: "ontario"
}, {
  code: "c174l9001",
  name: "b-autos-camions",
  category: "Automobiles",
  zone: "quebec"
}, {
  code: "c122l9001",
  name: "b-voiture-collection",
  category: "Automobiles",
  zone: "quebec"
}, {
  code: "c30l9001",
  name: "b-moto",
  category: "Automobiles",
  zone: "quebec"
}, {
  code: "c37l9004",
  name: "b-apartments-condos",
  category: "Real Estate",
  zone: "ontario"
}, {
  code: "c43l9004",
  name: "b-house-rental",
  category: "Real Estate",
  zone: "ontario"
}, {
  code: "c36l9004",
  name: "b-room-rental-roommate",
  category: "Real Estate",
  zone: "ontario"
}, {
  code: "c40l9004",
  name: "b-commercial-office-space",
  category: "Real Estate",
  zone: "ontario"
}, {
  code: "c37l9001",
  name: "b-appartement-condo",
  category: "Real Estate",
  zone: "quebec"
}, {
  code: "c43l9001",
  name: "b-maison-a-louer",
  category: "Real Estate",
  zone: "quebec"
}, {
  code: "c36l9001",
  name: "b-chambres-a-louer-colocataire",
  category: "Real Estate",
  zone: "quebec"
}, {
  code: "c40l9001",
  name: "b-local-commercial-bureau",
  category: "Real Estate",
  zone: "quebec"
}, {
  code: "c126l9004",
  name: "b-dogs-puppies",
  category: "Pets",
  zone: "ontario"
}, {
  code: "c135l9004",
  name: "b-birds",
  category: "Pets",
  zone: "ontario"
}, {
  code: "c125l9004",
  name: "b-cats-kittens",
  category: "Pets",
  zone: "ontario"
}, {
  code: "c126l9004",
  name: "b-dogs-puppies",
  category: "Pets",
  zone: "quebec"
}, {
  code: "c135l9001",
  name: "b-oiseaux",
  category: "Pets",
  zone: "quebec"
}, {
  code: "c125l9001",
  name: "b-chats-chatons",
  category: "Pets",
  zone: "quebec"
}, {
  code: "c160l9004",
  name: "b-cleaners-cleaning-service",
  category: "Services",
  zone: "ontario"
}, {
  code: "c84l9004",
  name: "b-childcare-nanny-service",
  category: "Services",
  zone: "ontario"
}, {
  code: "c83l9004",
  name: "b-fitness-personal-trainer",
  category: "Services",
  zone: "ontario"
}, {
  code: "c76l9004",
  name: "b-skilled-trades",
  category: "Services",
  zone: "ontario"
}, {
  code: "c160l9001",
  name: "b-entretien-menager",
  category: "Services",
  zone: "quebec"
}, {
  code: "c84l9001",
  name: "b-garderie-gardienne-cpe",
  category: "Services",
  zone: "quebec"
}, {
  code: "c83l9001",
  name: "b-entraineur-personel-prive",
  category: "Services",
  zone: "quebec"
}, {
  code: "c76l9001",
  name: "b-services-professionnels",
  category: "Services",
  zone: "quebec"
}, {
  code: "c16l9004",
  name: "b-computer",
  category: "Technology",
  zone: "ontario"
}, {
  code: "c132l9004",
  name: "b-phone-tablet",
  category: "Technology",
  zone: "ontario"
}, {
  code: "c15l9004",
  name: "b-electronics",
  category: "Technology",
  zone: "ontario"
}, {
  code: "c16l9001",
  name: "b-ordinateurs",
  category: "Technology",
  zone: "quebec"
}, {
  code: "c132l9001",
  name: "b-telephone-tablette",
  category: "Technology",
  zone: "quebec"
}, {
  code: "c15l9001",
  name: "b-electronique",
  category: "Technology",
  zone: "quebec"
}, {
  code: "c235l9004",
  name: "b-furniture",
  category: "Furniture",
  zone: "ontario"
}, {
  code: "c235l9001",
  name: "b-meubles",
  category: "Furniture",
  zone: "quebec"
}, {
  code: "c14l9004",
  name: "b-tickets",
  category: "Tickets",
  zone: "ontario"
}, {
  code: "c14l9001",
  name: "b-billets",
  category: "Tickets",
  zone: "quebec"
}, {
  code: "c5l9004",
  name: "b-rideshare-carpool",
  category: "Community",
  zone: "ontario"
}, {
  code: "c5l9001",
  name: "b-covoiturage",
  category: "Community",
  zone: "quebec"
}]

var createCategories = function() {
  async.eachSeries(categories, function(category, callback) {
    var name = category;
    var shortname = category.replace(/\s/g, '').toLowerCase();
    f = ff(function() {
      Category.findOne({
        shortname: shortname
      }).exec(f.slot())
    }, function(doc) {
      if (!doc) {
        cat = new Category({
          name: name,
          shortname: shortname
        })
        cat.save(f.wait());
        console.log(cat);
        callback();
      } else {
        callback()
      }
    });
  }, function() {
    console.log("all the categories have been created");
  })
}

var createZones = function() {
  async.eachSeries(categories, function(category, callback) {
    var name = category;
    var shortname = category.replace(/\s/g, '').toLowerCase();
    f = ff(function() {
      Category.findOne({
        shortname: shortname
      }).exec(f.slot())
    }, function(doc) {
      if (!doc) {
        cat = new Category({
          name: name,
          shortname: shortname
        })
        cat.save(f.wait());
        console.log(cat);
        callback();
      } else {
        callback()
      }
    });
  }, function() {
    console.log("all the categories have been created");
  })
}

var createUrls = function() {
  var category, zone, urldoc;
  async.eachSeries(urls, function(url, callback) {
    var shortname = url.category.replace(/\s/g, '').toLowerCase();
    f = ff(function() {
      Category.findOne({
        shortname: shortname
      }).exec(f.slot())
    }, function(cat) {
      console.log("CATEGORY")
      console.log(cat);
      g = ff(function() {
        Zone.findOne({
          shortname: url.zone
        }).exec(g.slot())
      }, function(zone) {
        if (!zone) {
          zone = new Zone({
            name: url.zone,
            shortname: url.zone,
            urls: []
          });
        };
        h = ff(function() {
          Url.findOne({
            code: url.code
          }).exec(h.slot())
        }, function(doc) {
          i = ff(this, function() {
            if (!doc) {
              urldoc = new Url({
                route: url.name,
                code: url.code,
                zone: zone._id,
                type: "kijiji",
                category: cat._id,
                modified: new Date()
              });
              console.log("AD");
              console.log(urldoc);
              zone.urls.push(urldoc._id);
              cat.urls.push(urldoc._id);
              console.log("ZONE");
              console.log(zone);
            } else {
              console.log("for some reason it exits!!")
            };
          })

          i.then(function() {
            console.log("Everything should be done");
            cat.save()
            zone.save()
            urldoc.save()
            callback()
          })

        });
      });
    });
  }, function() {
    console.log("Asyc finished successfully");
  });
};

router.get('/categories', function(req, res) {
  createCategories();
  res.send("Setting the categories");
})

router.get('/urls', function(req, res) {
  createUrls();
  res.send("Setting the urls");
})
router.get('/zones', function(req, res) {
  createZones();
  res.send("Setting the zones");
})
module.exports = router;
