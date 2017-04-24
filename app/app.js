(function(){
	'use strict';

	angular.module('weatherApp', ['auth0', 'angular-storage', 'angular-jwt', 'ui.router']);

	angular
		.module('weatherApp')
		.controller('GlobalCtrl', function ($scope){

			// Change Intro Bkg
			$scope.$on('$stateChangeStart', function(event, toState, toParams) {
				var className = toState.name.replace(/[\W_]+/g, ''); // gets rid of all 
				console.log(className)
		    	$scope.bodyClass = className + '-page';
			});
			
		})
		.config(function($stateProvider, $urlRouterProvider, $provide, authProvider, $httpProvider, jwtInterceptorProvider){

			authProvider.init({
				domain: 'paperboatz.auth0.com',
				clientID: 'Ogbt8GXgLCALmc2quBLz2hCQWPDEPRn5'
			});

			// Has hold of Angular storage
			// Return jwt from local storage
			// will give the jwt token to jwtIntercepterprovider to attach to authorization header to our request 
			// now need to push this intercepter onto array of http interceptors that come from angular
			jwtInterceptorProvider.tokenGetter = function(store){
				return store.get('id_token');
			}

			$urlRouterProvider.otherwise('/');

			$stateProvider
			.state('intro',{
				url:'/',
				templateUrl:'site/partials/intro.html',
				controller: 'IntroCtrl as ctrl',
			})
			.state('user',{
				url:'/user',
				templateUrl:'site/partials/nav.html',
				controller: 'NavFootCtrl as ctrl'
			})
			.state('user.front_page',{
				url:'/front',
				templateUrl:'site/partials/user-front.html',
				controller: 'FrontCtrl as ctrl',
				resolve:{
						
						locoFrontObj: function($q){
							
							var latLong;
							var defer = $q.defer();
							var timePassed = false;

							// Error for Moz bug if the user pressed 'not now' for geolocation
							// 'not now' option does not trigger anything to respond to
							(function notNowGeo(){
								timePassed = true;

								latLong = {
									latitude: 40.714224,
									longitude: -73.961452
								};

								setTimeout(function(){
									if(timePassed){
										timePassed = false;
										console.log('User chose Not Now GeoLocation option')
										return defer.resolve(latLong)}
									}, 1000);
							})();
							
							(function getLocation() {
							    if (navigator.geolocation) {
							        navigator.geolocation.getCurrentPosition(showPosition, showError);
							    } else { 
							        user.words = "Geolocation is not supported by this browser.";
							    }
							})();

							function showPosition(position){
								timePassed = false;
								console.log(position)
		    					latLong = { 
		    						latitude: position.coords.latitude,
		    						longitude: position.coords.longitude
		    					};
		    					defer.resolve(latLong);
							}

							function showError(error) {
								timePassed = false;
								console.log(error);
								// New York Temp default
								latLong = {
									latitude: 40.714224,
									longitude: -73.961452
								};

							    switch(error.code) {
							        case error.PERMISSION_DENIED:
							            console.log("User denied the request for Geolocation.") 
							            break;
							        case error.POSITION_UNAVAILABLE:
							            console.log("Location information is unavailable.") 
							            break;
							        case error.TIMEOUT:
							            console.log("The request to get user location timed out.") 
							            break;
							        case error.UNKNOWN_ERROR:
							            console.log("An unknown error occurred.") 
							            break;
							    }
							    return defer.resolve(latLong);
							}

							return defer.promise; 
					}// eo locationObj
				} // eo resolve obj
			})
			.state('user.dash',{
				url:'/dash',
				templateUrl:'site/partials/user-dash.html',
				controller:'DashCtrl as ctrl',
			})
			.state('user.settings',{
				url:'/settings',
				templateUrl:'site/partials/user-settings.html',
				controller:'SettingsCtrl as ctrl',
			})
			.state('user.add_shoe',{
				url:'/add_shoe',
				templateUrl:'site/partials/user-add-shoe.html',
				controller:'ShoeCtrl as ctrl',
			})
			.state('user.edit_shoe',{
				url:'/edit_shoe/:shoeId',
				templateUrl:'site/partials/user-edit-shoe.html',
				controller:'ShoeCtrl as ctrl',
			});

			// create a redirect if a user needs to login again (if token times out or tampered out)
			// if 401 is recieved they will be redirected to home
			// $q - async service

		      function redirect($q, $injector, $timeout, store, $location) {

		        var auth;
		        $timeout(function() {
		          auth = $injector.get('auth');
		        });

		        return {
		          responseError: function(rejection) {

		            if (rejection.status === 401) {
		              auth.signout();
		              store.remove('profile');
		              store.remove('token');
		              // $location.path('/home')
		            }
		            return $q.reject(rejection);
		          }
		        }
		      }

			// Make angular know about this interceptor 
			// $provide.factory - will take the redirect funciton
			// push it onto array of http interceptors
			$provide.factory('redirect', redirect);
			$httpProvider.interceptors.push('redirect');

			// push jwtInterceptor, name of interceptor as defined in angular-jwt not provider
			$httpProvider.interceptors.push('jwtInterceptor');

		})//EO config
		.run(function($rootScope, auth, store, jwtHelper, $state, $location){ 

			// .run logic that happens after app is running
			// $rootScope watches changes in app location
			// jwtHelper inspects jwt tokens
			// $locationChangeStart - this watches for event, this gets fired anytime...
			// we move new spot in app or refreshed
			// use it to check for user's auth state
			$rootScope.$on('$locationChangeStart', function(){
				
				// looking for token in local storage storage
				var token = store.get('id_token');

				// if there is token
				// if that token is not expired 
				// and if user not authenticated, then authenticate the user
				// Why? because if user has a token, then user token hasn't been expired is authenticated 
				// use auth service (auth.authenticate), pass our profile from storage and token
				if (token){
					if(!jwtHelper.isTokenExpired(token)){
						if(!auth.isAuthenticated){
							auth.authenticate(store.get('profile'), token)
						}
					}
				} else { // or redirect the user to home root so it can log in again
					$location.path('/'); 
				}
			})// eo $rootScope 
		})// eo .run
})()

// RESOLVE solve!
// it takes time for showPosition to return data
// so everytime we console.log out the latLong
// it it would return undefined
// not until we put a timeout on the variable
// then we saw when the latLong fill with data
// once it did, we needed to defer the promise
// because we can't return it right away without the data
// so we created a promise on it to wait
// after it waited, then it would return the value
// into the controller.
// we inject the named 'object' into controler
// and bind it to the scope

// this time out was to test
// how long to get the data back from 
// showPosition

// $timeout(function(){ 
// 	console.log('hello');
// 	console.log(latLong); 
// }, 4000);


// Put values inside the defer.resolve()
// return defer.promise will initiate the promise
// the $timeout - built in angular fcn will wait until
// the data returns
