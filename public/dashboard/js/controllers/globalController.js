dashboardApp.controller('globalController', function(
  $scope, 
  $location, 
  socket, 
  $http, 
  $rootScope, 
  authService, 
  $localStorage) {
  'use strict';
  console.log('#### Global Controller');
  console.log($localStorage);

  $scope.authCheck = function() {
	  if(!$localStorage.user) {
	  	console.log('#### No user is logged in');
	  	setTimeout(function() {
	  		$scope.loginBlur();
	  	}, 500);
	  } else {
	  	console.log('#### User is logged in');
	  }  	
  };
  $scope.authCheck();
  $scope.logout = function() {
  	console.log('#### Logging user out');
  	$localStorage.$reset();
  	$scope.authCheck();
  };

  $scope.login = function() {
  	console.log($scope.auth);
  	authService.login($scope.auth);
  };

  $rootScope.$on('login response', function() {
  	console.log('#### Broadcast form login service');
  	console.log($rootScope.loginResponse);
  	if($rootScope.loginResponse.message === 'Incorrect Username' || $rootScope.loginResponse.message  === 'Incorrect Password') {
  		$scope.err = 'true';
  		$scope.loginerrmessage = $rootScope.loginResponse.message;
  		$scope.loginError();
  		setTimeout(function() {
  			$scope.err = 'false';
  			$scope.$apply();
  		}, 2000);
  	}
  	if($rootScope.loginResponse.message === 'Authenticated') {
  		$localStorage.user = $rootScope.loginResponse.user;
  		console.log($localStorage);
  		$scope.loguserIn();
  	}
  });
});
