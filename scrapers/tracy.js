var express = require('express');
var router = express.Router();
var async = require('async');
var ff = require('ff');
var cheerio = require('cheerio');
var request = require('request');
var phantom = require('phantomjs');
var Nightmare = require('nightmare');

router.get('/', function(req, res) {
  console.log('#### starting scrape');
  var f = ff(function() {
    var url = 'http://www.nba.com/dleague/losangeles/schedule';
    request(url, f.slotMulti(2));
  }, function(response, html) {
    var $ = cheerio.load(html);
    console.log('##### This is the html');
    console.log(html);
    res.send(html);
  })
})

router.get('/nightmare', function(req, res) {
  console.log('#### Running the nightmare scraper');
  res.send('Scraping using nightmare');
  new Nightmare()
    .goto('http://www.nba.com/dleague/losangeles/schedule')
    .run();
})

module.exports = router;
