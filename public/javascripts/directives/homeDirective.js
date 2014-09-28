homeApp.directive('home', function($http, socket) {
    var linkFn;
    linkFn = function(scope,element,attrs) {
        console.log(scope.username);

    }
    return {
        restrict:'E',
        link: linkFn
    }    
});