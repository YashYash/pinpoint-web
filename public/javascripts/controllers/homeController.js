homeApp.controller('homeController', function($scope, $location,socket, $http) {
	console.log("home controller is working");
	socket.on("call api", function(data) {
		$http.post("/api/test").success(function(test) {
			console.log(test);
		})
	})
});