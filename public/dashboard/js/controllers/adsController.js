dashboardApp.controller('adsController', function(
  $scope, 
  $location, 
  socket, 
  $http) {
  'use strict';
  console.log('#### Ads Controller');

  $scope.url = $location.$$url;
  $scope.activateNav($scope.url);
  $scope.onload();
  $scope.tiles = 'true';
  $scope.limit = 25;

  $scope.getZones = function() {
    $http.get('/api/zones').success(function(zones) {
      $scope.zones = zones;
      $scope.currzone = zones[0];
      $scope.getCategories();
    }).error(function(data, status, headers, config) {
      console.log('there was an error in getZones');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  $scope.getCategories = function() {
    $http.get('/api/categories').success(function(categories) {
      $scope.categories = categories;
      $scope.currcat = categories[0];
      $scope.getAds($scope.currzone, $scope.currcat);
    }).error(function(data, status, headers, config) {
      console.log('there was an error in getCategories line 20');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  $scope.getAds = function(zone, category) {
    $scope.currzone = zone;
    $scope.currcat = category;
    console.log($scope.currzone, $scope.currcat);
    $http.get('/api/ads/' + zone.shortname + '/' + category._id).success(function(ads) {
      console.log(ads);
      $scope.ads = ads;
    }).error(function(data, status, headers, config) {
      console.log('there was an error');
      console.log('status: ' + status);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    });
  };

  socket.on('update scope', function(data) {
    console.log('Socket message: ');
    console.log(data);
    if (data.zone.length > 1 && data.category !== null) {
      var sendzone = {
        shortname: data.zone
      };
      var sendcat = {
        _id: data.category
      };
      $scope.getAds(sendzone, sendcat);
    } else {
      $scope.getZones();
    }
  });

  $scope.getZones();
});
