var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngAnimate', 'ngStorage']);
'use strict';
dashboardApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/dashboard/views/scrapers.html', 
        controller: 'scrapersController'
    });    
    $routeProvider.when('/ads', {
        templateUrl: '/dashboard/views/ads.html', 
        controller: 'adsController'
    });     
}]);

dashboardApp.factory('socket', function($scope){
    if($scope.env === 'development') {
        console.log('#### socket.io in development');
        var socket = io.connect('http://localhost:3000');
        return socket;
    } else {
        var socket = io.connect('http://pinpoint-web.herokuapp.com');
        return socket;        
    }
});

