dashboardApp.controller('scrapersController', function(
  $scope, 
  $location, 
  socket, 
  $http) {

  'use strict';

  console.log('#### THIS IS THE ENVIRONMENT ####');
  console.log($scope.env);
  $scope.url = $location.$$url;
  $scope.activateNav($scope.url);
  $scope.onload();

  console.log('#### Scraper Controller');
  
  $scope.zone = [];
  $scope.currzone = '';
  $scope.currcategory = '';
  $scope.categories = [];
  $scope.urls = [];
  $scope.route = '';
  $scope.code = '';

  $scope.getZones = function() {
    $http.get('/api/zones').success(function(zones) {
      $scope.zones = zones;
      $scope.currzone = zones[0];
      $scope.getCategories();
    }).error(function(data, status, headers, config) {
      console.log('there was an error in getZones line 12');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  $scope.getCategories = function() {
    $http.get('/api/categories').success(function(categories) {
      $scope.categories = categories;
      $scope.currcategory = categories[0];
      $scope.getUrls($scope.currzone, $scope.currcategory);
    }).error(function(data, status, headers, config) {
      console.log('there was an error in getCategories line 20');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  $scope.getUrls = function(zone, cat) {
    $scope.currzone = zone;
    $scope.currcategory = cat;
    $http.get('/api/urls/' + zone._id + '/' + cat._id).success(function(urls) {
      $scope.urls = urls;
      if ($scope.route === '' && $scope.code === '') {
        $scope.route = urls[0].route;
        $scope.code = urls[0].code;
      }
      $scope.check();
    }).error(function(data, status, headers, config) {
      console.log('there was an error in getUrls line 28');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  $scope.check = function() {
    console.log($scope.zones);
    console.log($scope.categories);
    console.log($scope.urls);
  };

  $scope.setUrl = function(url) {
    $scope.route = url.route;
    $scope.code = url.code;
  };

  $scope.updateList = function() {
    var data = {
      message: "Scrape " + $scope.route + ' in ' + $scope.currzone.name,
      code: $scope.code,
      route: $scope.route,
      zone: $scope.currzone.name
    };
    $scope.list.push(data);
  };

  $scope.removeAd = function(ad) {
    for (var i = 0; i < $scope.list.length; i++) {
      if (ad._id === $scope.list[i]._id) {
        $scope.list.splice(i, 1);
        break;
      }
    }
    console.log('removed ad');
  };

  socket.on('starting scraper', function(data) {
    console.log('data from schedules.js');
    console.log(data);
  });

  socket.on('error occured', function(err) {
    console.log(err);
  });

  $scope.index = 0;
  $scope.scrapeAll = function() {
    $scope.miniStatus();
    console.log($scope.list);
    $scope.scrape = function(index) {
      if ($scope.list.length > index) {
        console.log($scope.list.length);
        console.log($scope.index);
        console.log('here');
        var data = $scope.list[$scope.index];
        $http.get('/scrape/kijiji/' + data.route + '/' + data.zone + '/' + data.code + '/1').success(function(response, status, headers, config) {
          console.log(response);
          $scope.scrapeCats.push(response);
        }).error(function(data, status, headers, config) {
          console.log('there was an error in the postcall');
          console.log('status: ' + status);
          console.log('headers: ' + headers);
          console.log('config: ' + config);
        });
      } else {
        console.log('done looping through this shit');
        $scope.index = 0;
        $scope.list = [];
      }
    };
    socket.on('scraped ads', function(data) {
      console.log('scraped url');
      console.log(data);
      $scope.index = $scope.index + 1;
      if ($scope.list.length > $scope.index) {
        $scope.scrape($scope.index);
      } else {
        $scope.$apply(function() {
          $scope.index = 0;
          $scope.list = [];
        });

      }
    });
    $scope.scrape($scope.index);
  };

  $scope.getZones();
});
