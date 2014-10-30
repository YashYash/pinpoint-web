;dashboardApp.directive('global', function($http, socket) {
    'use strict';
    var linkFn;
    linkFn = function(scope, element, attrs) {
        console.log("This is the global directive");
        var hideStatus;

        // Top Route Nav
        scope.activateNav = function(url) {
            console.log('in activate nav');
            console.log(url);
            if(url === '/ads') {
                $('#ads-nav-item').addClass('active-nav-item');
                $('#scrapers-nav-item').removeClass('active-nav-item');
            }
            if(url === '/') {
                $('#scrapers-nav-item').addClass('active-nav-item');
                $('#ads-nav-item').removeClass('active-nav-item');
            }            
        };

        scope.onload = function() {
        	console.log('onload called');
	        $('#container').hide();
	        setTimeout(function() {
	        	$('#container').fadeIn();
	        }, 1000);
        };

        // Side Nav
        scope.sideBar = function() {
            $('#menu-toggle').toggleClass('active');
            $('#nav').toggleClass('shownav');
            $('#container').toggleClass('shiftcontainer');
            $('#status').toggleClass('shifticons');
            $('#quick').toggleClass('shifticons');
            $('#idea').toggleClass('shifticons');
            $('#menu-toggle').toggleClass('shifticons');
        };   

        // Flash
        scope.flashMode = function() {
        	$('#global').addClass('globalblur');
        	$('#lightning-blur').show();
        	$('#lightining').fadeIn();
        	$('#flashinput').focus();
        }; 	

        scope.hideFlash = function() {
        	$('#lightning-blur').hide();
        	$('#lightining').fadeOut();          	
        	$('#global').removeClass('globalblur');      	
        };


        $('#flashi;nput').on('focus', function() {
            $('#flashinput').addClass('activeFlash');
        });

        $('#flashinput').on('focusout', function() {
            $('#flashinput').removeClass('activeFlash');
        });

        // Scrape Status
        scope.scraperStatus = function() {
        	$('#status-section').removeClass('mini-status');
        	$('#global').removeClass('slide-global-mini');
        	$('#status-section').toggleClass('hide-status visible-status');
        	$('#global').toggleClass('normal-global slide-global');
        	$('#global').toggleClass('globalblur');
        };

        scope.miniStatus = function() {
        	$('#status-section').addClass('mini-status');
        	$('#global').addClass('normal-global slide-global-mini');        	
        };

        scope.list = [];
        scope.scrapeCats = [];
        scope.scrapeAds = [];

        scope.currentstatus = 'Currently no scrapers are running';

        socket.on('update status', function(status) {
        	console.log('working in global direcetive');
        	scope.$apply(function() {
        		scope.currentstatus = status;
        	});
        });

        scope.count = 0;
        socket.on('update count', function(data) {
        	scope.count = scope.count + 1;
            scope.scrapeAds.push(data);

        });

        scope.flashRequest = function() {
            $('#flashloader').fadeIn()
            if(scope.flash === 'clear all' || scope.flash === 'remove all' || scope.flash === 'clear scope') {
                scope.list = [];
                scope.scrapeCats = [];
                scope.scrapeAds = [];
            }
        };

    };
    return {
        restrict:'E',
        link: linkFn
    };   
});