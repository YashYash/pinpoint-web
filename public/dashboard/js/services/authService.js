dashboardApp.factory('authService', function($location, socket, $http, $rootScope) {
  'use strict';
  console.log('this is the auth service');
  return {
  	login: function(user) {
  		console.log('logging in');
  		console.log(user);
  		var data = {
  			username: user.username,
  			password: user.password
  		};
  		$http.post('/auth/login', data).success(function(res) {
  			console.log('Login function succeded');
  			console.log('response');
  			console.log(res);
  			$rootScope.loginResponse = res;
  			$rootScope.$broadcast('login response', null);
  		}).error(function(err, config, headers) {
  			console.log('Error logging in');
  			console.log('err: ' + err);
  			console.log('config: ' + config);
  			console.log('headers: ' + headers);
  		});
  	}
  };
});
