var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ui.map', 'ui.event', 'ngAnimate']);

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

dashboardApp.factory('socket', function(){
    var socket = io.connect('http://localhost:3000');
    return socket;
})

