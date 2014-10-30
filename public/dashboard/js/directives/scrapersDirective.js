dashboardApp.directive('scrapers', function($http, socket) {
    'use strict';
    var linkFn;
    linkFn = function(scope,element,attrs) {
        console.log('This is the scrapers directive');

        var showInput;

        showInput = function() {
        	$(this).fadeOut();
        	$(this).siblings('input').fadeIn().focus();
        };

        $(element).on('click', '.icon-search', showInput);
    };
    return {
        restrict:'E',
        link: linkFn
    };
});