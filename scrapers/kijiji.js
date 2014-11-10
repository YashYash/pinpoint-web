var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var cheerio = require('cheerio');
var request = require('request');
var Account = require('../models/account');
var Ad = require('../models/ads');
var Category = require('../models/category');
var Url = require('../models/url');
var async = require('async');
var ff = require('ff');
var geocoder = require('geocoder');
var jq = require('jquerygo');
var adurls = [];
var globalcategory;
var globalzone;
var globalpages;
var globalshortname;
var categoryName;
var categoryShortname;
var globaltags;
var adcount = 0;
var http = require('http');
var scrape;
var status;

socket.on('scrape request', function(data) {
  console.log('in here');
  console.log(data);
});
socket.on('testing connection', function(data) {
  console.log(data);
});

scrape = function(category, zone, urlcode, pages) {
  console.log(zone);
  socket.emit('starting scraper', 'Starting Scrape');

  // Automobiles
  if (category === 'b-cars-trucks') {
    categoryName = 'Automobiles';
    categoryShortname = 'automobiles';
    globaltags = ['cars', 'trucks', 'vans', 'coupe', 'sedan', 'car', 'truck', 'sedans', 'van'];
  }
  if (category === 'b-classic-cars') {
    categoryName = 'Automobiles';
    categoryShortname = 'automobiles';
    globaltags = ['classic cars'];
  }
  if (category === 'b-motorcycles') {
    categoryName = 'Automobiles';
    categoryShortname = 'automobiles';
    globaltags = ['bikes', 'bike', 'motorcycle', 'motorbike'];
  }


  // Real Estate
  if (category === 'b-real-estate') {
    categoryName = 'Real Estate';
    categoryShortname = 'realestate';
    globaltags = ['house', 'appartment', 'condo', 'houses', 'appartments', 'condos', 'flat', 'duplex', 'townhouse', 'townhouse', 'sublet', 'lease']
  }
  if (category === 'b-apartments-condos') {
    categoryName = 'Real Estate';
    categoryShortname = 'realestate';
    globaltags = ['appartment', 'condos'];
  }
  if (category === 'b-house-rental') {
    categoryName = 'Real Estate';
    categoryShortname = 'realestate';
    globaltags = ['houses', 'house'];
  }
  if (category === 'b-room-rental-roommate') {
    categoryName = 'Real Estate';
    categoryShortname = 'realestate';
    globaltags = ['room', 'rental'];
  }
  if (category === 'b-commercial-office-space') {
    categoryName = 'Real Estate';
    categoryShortname = 'realestate';
    globaltags = ['office space', 'commercial'];
  }


  // Pets
  if (category === 'b-pets') {
    categoryName = 'Pets';
    categoryShortname = 'pets';
    globaltags = ['pets'];
  }
  if (category === 'b-dogs-puppies') {
    categoryName = 'Pets';
    categoryShortname = 'pets';
    globaltags = ['dogs', 'puppies', 'dog', 'puppy'];
  }
  if (category === 'b-birds') {
    categoryName = 'Pets';
    categoryShortname = 'pets';
    globaltags = ['birds'];
  }
  if (category === 'b-cats-kittens') {
    categoryName = 'Pets';
    categoryShortname = 'pets';
    globaltags = ['cats', 'kittens', 'cat', 'kitten'];
  }

  // Services
  if (category === 'b-cleaners-cleaning-service') {
    categoryName = 'Services';
    categoryShortname = 'services';
    globaltags = ['clean', 'maid', 'service', 'clearner'];
  }
  if (category === 'b-childcare-nanny-service') {
    categoryName = 'Services';
    categoryShortname = 'services';
    globaltags = ['children', 'baby sitter', 'nanny', 'childcare'];
  }
  if (category === 'b-fitness-personal-trainer') {
    categoryName = 'Services';
    categoryShortname = 'services';
    globaltags = ['train', 'trainer', 'personal trainer', 'athletic trainer'];
  }
  if (category === 'b-photography-video') {
    categoryName = 'Services';
    categoryShortname = 'services';
    globaltags = ['photgraphy', 'event photgraphy', 'photographer'];
  }
  if (category === 'b-tutor-language-lessons') {
    categoryName = 'Services';
    categoryShortname = 'services';
    globaltags = ['tutor', 'learn', 'language'];
  }

  // Technology
  if (category === 'b-computer') {
    categoryName = 'Technology';
    categoryShortname = 'technology';
    globaltags = ['computers', 'laptops', 'desktops', 'screens', 'technology'];
  }
  if (category === 'b-phone-tablet') {
    categoryName = 'Technology';
    categoryShortname = 'technology';
    globaltags = ['phone', 'phones', 'android', 'iphone', 'cellphone', 'tablet', 'ipad'];
  }
  if (category === 'b-electronics') {
    categoryName = 'Technology';
    categoryShortname = 'technology';
    globaltags = ['electronics'];
    console.log('electronics in here');
  }

  // Furniture
  if (category === 'b-furniture') {
    categoryName = 'Furniture';
    categoryShortname = 'furniture';
    globaltags = ['chairs', 'tables', 'sofas', 'furniture'];
  }

  // Jewelry
  if (category === 'b-jewelry-watch') {
    categoryName = 'Jewelry';
    categoryShortname = 'Jewelry';
    globaltags = ['Jewelry'];
  }

  // Tickets
  if (category === 'b-tickets') {
    categoryName = 'Tickets';
    categoryShortname = 'tickets';
    globaltags = ['tickets'];
  }

  // Clothing
  if (category === 'b-clothing') {
    categoryName = 'Clothing';
    categoryShortname = 'clothing';
    globaltags = ['clothing'];
  }

  // Sporting
  if (category === 'b-sporting-goods-exercise') {
    categoryName = 'Sporting';
    categoryShortname = 'sporting';
    globaltags = ['sporting'];
  }

  // Volunteers
  if (category === 'b-volunteers') {
    categoryName = 'Volunteers';
    categoryShortname = 'volunteers';
    globaltags = ['volunteering', 'volunteers'];
  }

  // Community
  if (category === 'b-rideshare-carpool') {
    categoryName = 'Community';
    categoryShortname = 'community';
    globaltags = ['carpool', 'rideshare'];
  }

  status = 'Scraping ' + pages + ' pages for ' + categoryName + '  in zone ' + zone;
  console.log('#### ' + status);
  socket.emit('update status', status);
  globalzone = zone;
  globalpages = pages;

  var f = ff(function() {
    var urls = [{
      url: 'https://www.kijiji.ca/' + category + '/' + zone + '/' + urlcode,
      page: 1,
      category: categoryName
    }];
    var totalpages = pages;
    for (var i = 2; i <= totalpages; i++) {
      urls.push({
        url: 'https://www.kijiji.ca/' + category + '/' + zone + '/page-' + i + '/' + urlcode,
        page: i,
        category: categoryName
      });
    }
    var g = ff(function() {
      async.eachSeries(urls, function(url, callback) {
        var allads = [];
        status = 'Starting to scrape page ' + url.page + ' of ' + url.category;
        socket.emit('update status', status);
        console.log('#### ' + status);
        console.log(url.url);
        var h = ff(function() {
          request(url.url, h.slotMulti(2));
        }, function(response, html) {
          var $ = cheerio.load(html);
          var ads = $('.container-results').children('table');
          ads.each(function(i, elem) {
            allads.push($(this));
          });
          var i = ff(function() {
            async.eachSeries(allads, function(ad, callback) {
              var thumbnail = ad.children('tr').children('td.image').children('div.multiple-images').children('img').attr('src');
              var adurl = ad.children('tr').children('td.description').children('a.title').attr('href');
              adurls.push('http://www.kijiji.ca' + adurl);
              callback();
            }, function() {
              console.log('#### Finished scarping page ' + url.page + ' of ' + url.category);
              status = 'Finished scarping page ' + url.page + ' of ' + url.category;
              socket.emit('update status', status);
              callback();
            });
          });
        });
      }, function() {
        console.log('#### Done scraping all pages. Passing urls onto next function');
        status = 'Obtained ' + adurls.length + 'Ad Urls from ' + globalpages;
        socket.emit('update status', status);
        console.log(adurls.length);
        createCategory(adurls);
      });
    }).onError(function(err) {
      console.log(err.stack);
    });
  });

  var createCategory = function(adurls) {
    f = ff(this, function() {
      Category.findOne({
        shortname: categoryShortname
      }).exec(f.slot());
    }, function(cat) {
      if (!cat) {
        var cat = new Category({
          shortname: categoryShortname,
          name: categoryName,
          ads: []
        });
        console.log('#### New Category');
        status = 'New Category has been created: ' + cat.name;
        socket.emit('update status', status);
        globalcategory = cat;
        cat.save(f.wait());
      } else {
        cat.ads = [];
        globalcategory = cat;
        console.log('#### Existing Category');
        status = 'Existing Category has been updated: ' + cat.name;
        socket.emit('update status', status);
        cat.save(f.wait());
      }
    }, function() {
      console.log('#### Category Saved');
      l = ff(this, function() {
        Ad.remove({
          category: globalcategory._id,
          zone: globalzone,
          tags: globaltags
        }, function() {
          console.log('#### REMOVED ALL EXISTING ACTIVITIES FROM ' + categoryName + ' IN ZONE ' + zone + 'WITH TAGS' + globaltags);
          status = 'REMOVED ALL EXISTING ACTIVITIES FROM ' + categoryName + ' IN ZONE ' + zone + ' WITH TAGS ' + globaltags;
          socket.emit('update status', status);
        });
      });
      l.then(function() {
        scrapeUrls(adurls);
      });
    });
  };

  var scrapeUrls = function(urls) {

    f = ff(function() {
      async.eachSeries(urls, function(url, next) {
        if (url.indexOf('?src=topAdSearch') > -1) {
          var url = url.substring(0, url.length - 16);
        }
        console.log(url);
        status = 'Now scraping ' + url;
        socket.emit('update status', status);
        g = ff(function() {
          request(url, g.slotMulti(2));
        }, function(response, html) {
          var $ = cheerio.load(html);
          var alltrs = [];
          var title = $('h1').text();
          var listed = '';
          var price = '';
          var seller = '';
          var make = '';
          var address = '';
          var kilometers = '';
          var vehicletype = '';
          var transmission = '';
          var color = '';
          var drive = '';
          var fuel = '';
          var description = $('#UserContent').find('tr').text().trim();
          var source = 'kijiji';
          var zone = globalzone;
          var shortname = title.replace(/\s/g, '').toLowerCase();
          var lng = '';
          var lat = '';
          var bathrooms = '';
          var rentby = '';
          var furnished = '';
          var petfriendly = '';
          var dateofbirth = '';
          var offeredby = '';
          var size = '';
          var trs = $('table.ad-attributes').children('tr');
          trs.each(function(i, elem) {
            alltrs.push($(this));
          });
          var images = $('ul#ShownImage').children('li');
          i = ff(function() {
            async.eachSeries(alltrs, function(tr, nexttr) {
              var heading = tr.children('th').text().trim();
              if (heading === 'Date Listed') {
                listed = tr.children('td').text().trim();
              }
              if (heading === 'Price') {
                price = tr.children('td').text().trim();
              }
              if (heading === 'Address') {
                address = tr.children('td').text().replace('View map', '').trim();
              }
              if (heading === 'For Sale By') {
                seller = tr.children('td').text().trim();
              }
              if (heading === 'Make') {
                make = tr.children('td').children('a').text().trim();
              }
              if (heading === 'Model') {
                model = tr.children('td').children('a').text().trim();
              }
              if (heading === 'Kilometers') {
                kilometers = tr.children('td').text().trim();
              }
              if (heading === 'Body Type') {
                vehicletype = tr.children('td').text().trim();
              }
              if (heading === 'Transmission') {
                transmission = tr.children('td').text().trim();
              }
              if (heading === 'Colour') {
                color = tr.children('td').text().trim();
              }
              if (heading === 'Drivetrain') {
                drive = tr.children('td').text().trim();
              }
              if (heading === 'Fuel Type') {
                fuel = tr.children('td').text().trim();
              }

              if (heading === 'Bathrooms (#)') {
                bathrooms = tr.children('td').text().trim();
              }
              if (heading === 'For Rent By') {
                rentby = tr.children('td').text().trim();
              }
              if (heading === 'Furnished') {
                furnished = tr.children('td').text().trim();
              }
              if (heading === 'Pet Friendly') {
                petfriendly = tr.children('td').text().trim();
              }

              if (heading === "Pet's Date of Birth") {
                dateofbirth = tr.children('td').text().trim();
              }
              if (heading === 'Offered By') {
                offeredby = tr.children('td').text().trim();
              }
              if (heading === 'Size (sqft)') {
                size = tr.children('td').text().trim();
              }

              nexttr();
            }, function() {
              console.log('#### async is done now');
              if (address.length > 2) {
                geocoder.geocode(address, i.slot());
              } else {
                next();
              }
            });
          }, function(geo) {
            if (geo) {
              console.log(geo);
              if (geo.results.length < 1) {
                console.log('there is no location');
                status = 'This ad has no location associated with it. Skipping it.';
                socket.emit('update status', status);
                next();
              }
              if (geo.status === 'ZERO_RESULTS') {
                console.log('This ad has no location associated with it. Skipping it');
                status = 'This ad has no location associated with it. Skipping it.';
                socket.emit('update status', status);
                next();
              }
              if (geo.status === 'UNKNOWN_ERROR') {
                status = 'This ad has no location associated with it. Skipping it.';
                socket.emit('update status', status);
                next();
              }
              if (geo.results.length > 0 && geo.status !== 'ZERO_RESULTS' && geo.status !== 'UNKNOWN_ERROR') {
                lat = geo.results[0].geometry.location.lat;
                lng = geo.results[0].geometry.location.lng;
              }
            } else {
              next();
            }

            h = ff(this, function() {
              var ad = new Ad({
                title: title,
                url: url,
                price: price,
                address: address,
                seller: seller,
                make: make,
                kilometers: kilometers,
                vehicletype: vehicletype,
                transmission: transmission,
                color: color,
                drive: drive,
                fuel: fuel,
                description: description,
                source: source,
                rentby: rentby,
                petfriendly: petfriendly,
                bathrooms: bathrooms,
                furnished: furnished,
                dateofbirth: dateofbirth,
                offeredby: offeredby,
                zone: zone,
                shortname: shortname,
                category: globalcategory._id,
                lng: lng,
                lat: lat,
                geo: [lng, lat],
                tags: globaltags
              });
              images.each(function(i, elem) {
                var image = $(this).children('img').attr('src');
                ad.images.push(image);
              });
              console.log('#### New Ad');
              status = 'New ad has been created ' + ad.title;
              socket.emit('status update', status);
              socket.emit('update count', ad);
              console.log(ad);
              ad.save();
              l = ff(function() {
                Category.findOne({
                  shortname: globalcategory.shortname
                }).exec(l.slot());
              }, function(category) {
                console.log(category);
                category.ads.push(ad._id);
                category.save();
              });
              console.log('saving the ad');
            }).onError(function(err) {
              console.log(err.stack);
            });

            h.then(function() {
              k = ff(this, function() {
                console.log('In the h = ff');
                adcount = adcount + 1;
                console.log('#### Updating ad count');
                var params = {
                  zone: globalzone,
                  category: globalcategory._id
                };
                socket.emit('update scope', params);
              });

              k.then(function() {
                console.log('#### Count updated: ' + adcount);
                console.log('#### New activity has been created');
                status = 'New Activiy has been created';
                socket.emit('update status', status);
                next();
              });
            }).onError(function(err) {
              console.log(err.stack);
            });
          }).onError(function(err) {
            socket.emit('error occured', err.stack);
          });
        }).onError(function(err) {
          console.log(err.stack);
        });
      }, function() {
        console.log('#### done scraping all urls. Scraped ' + adcount + 'Ads in ' + categoryName + ' from ' + globalpages + ' pages for ' + globalzone);
        var sendata = {
          count: adcount,
          name: categoryName,
          pages: globalpages,
          zone: globalzone
        };
        status = 'Done Scraping all the urls for ' + categoryName + ' in ' + globalzone;
        socket.emit('update status', status);
        socket.emit('scraped ads', sendata);
        adcount = 0;
        adurls = [];
        globalcategory = {};
        globalzone = '';
        globalpages = '';
        globalshortname = '';
        categoryName = '';
        categoryShortname = '';
        globaltags = [];

      });
    }).onError(function(err) {
      console.log(err.stack);
    });
  };
};

router.get('/:category/:zone/:urlcode/:pages', function(req, res) {
  var data = {
    category: req.params.category,
    zone: req.params.zone,
    urlcode: req.params.urlcode,
    pages: req.params.pages
  };
  console.log(data);
  scrape(data.category, data.zone, data.urlcode, data.pages);
  res.send(data);
});

router.get('/', function(req, res) {
  res.send('creating it');
  addUrl();
});

module.exports = router;
