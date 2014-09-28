var homeApp = angular.module('homeApp', ['ngRoute', 'ui.map', 'ui.event']);

homeApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/home.html', 
        controller: 'homeController'
    });       
}]);

homeApp.factory('socket', function(){
    var socket = io.connect('http://localhost:3000');
    return socket;
})

