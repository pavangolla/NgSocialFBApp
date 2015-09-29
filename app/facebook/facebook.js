'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])
.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('838406462943586');
  $facebookProvider.setPermissions("email, public_profile, user_posts, publish_actions, user_photos");	
})
.run(function($rootScope) {
	(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})

.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {
	$scope.isLoggegIn = false;
	
	$scope.login = function() {
		$facebook.login().then(function() {
			console.log('Logged in ...,')
			$scope.isLoggegIn = true;
			refresh();

		})
	}

	$scope.logout = function() {
		$facebook.logout().then(function() {
			console.log('Logged in ...,')
			$scope.isLoggegIn = false;
			refresh();

		})
	}

	function refresh() {
		$facebook.api("/me").then(function(response) {
			$scope.welcomeMsg = "Welcome " + response.name;
			$scope.isLoggegIn = true;
			$scope.userInfo = response;
			console.log($scope.userInfo);
			$facebook.api("/me/picture").then(function(response) {
				$scope.picture = response.data.url;
			});
			$facebook.api("/me/permissions").then(function(response) {
				$scope.permissions = response.data;
			});
			$facebook.api("/me/posts").then(function(response) {
				$scope.posts = response.data;
				console.log(response.data);
			});
		},
		function(err) {
			$scope.welcomeMsg = "Please log In";
		});
	}

	$scope.postStatus = function() {
		var body = this.myPost;
		console.log(body);
		$facebook.api('/me/feed', 'post', {message: body}).then(function(response) {
			$scope.msg = 'Thanks for Posting';
			refresh();
		});
	}

	refresh();
}]);