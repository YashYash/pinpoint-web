dashboardApp.directive('ads', function($http, socket) {
    'use strict';
    var linkFn;
    linkFn = function(scope, element, attrs) {
        console.log("This is the ads directive");

        scope.currmode = 'tiles';
        scope.viewMode = function(mode) {
        	console.log(mode);
        	if(mode === 'tiles') {
        		if(scope.currmode === 'tiles') {
        			$('#ads-list').removeClass('list');
	        		$('#ads-list').addClass('tiles');        			
        		} else {
        			scope.currmode = 'tiles';
        			$('#ads-list').hide();
        			setTimeout(function() {
        				$('#ads-list').fadeIn();
        			}, 800);
        			$('#ads-list').removeClass('list');
	        		$('#ads-list').addClass('tiles');        			
        		}
	
        	}
        	if(mode === 'list') {
        		scope.currmode = 'list';
        		$('#ads-list').removeClass('tiles');
        		$('#ads-list').addClass('list');        		
        	}
        };
    };
    return {
        restrict:'E',
        link: linkFn
    };   
});