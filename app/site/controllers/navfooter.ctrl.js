(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('NavFootCtrl', NavFootCtrl);

	function NavFootCtrl($state, auth, store, $location, $window){
		var navFootVm = this;

		navFootVm.hideNavAni = false;
		navFootVm.loaderGif = '../../assets/img/other/solecastlogo.svg';
		navFootVm.login = login;
		navFootVm.logout = logout;

		// auth service, to open lock widget, to make request to logging in
		// the auth service will hold property for template, useful to hold things like hiding and showing things 
		// will return true or false, depending if user has valid json token or not
		navFootVm.auth = auth;

		var token = store.get('id_token');
		
		// if there is token
		// then don't show the toolbar 
		// if there is a token, dont show the token
		if (token){
			navFootVm.sandboxBar = false;
		} else {
			navFootVm.sandboxBar = true;
		}

		/* Signin method from auth
		   pass empty object - can do configuration inside if we want to
		   profile holds details of user profile from auth0 Json
		   token is thier jwt, returned when user signs in
		   call back happens on sucessful login 
		   store info in local storage
		*/ 
		function login(){
			auth.signin({}, function(profile, token) {
				store.set('profile', profile); 
				store.set('id_token', token);
				$state.go('intro');
				$window.location.reload(); // refresh so my service's userId will not persist in shoeSrv
			}, function (error){
				console.log(error);
			});
		}

		function logout(){
			store.remove('profile'); // remove jwt & profile
			store.remove('id_token');
			auth.signout(); // clear state from auth service, and set property to tells property authenticated to false
			$state.go('intro');
			$window.location.reload(); // refresh so my shoeSrv userId will not persist
		}

		// Click logo to change logo to buffer image (which is animating)
		// then $state.go will go to user page
		// where it will reset the values;
		navFootVm.logo = function(){	
			navFootVm.hideNavAni = true;

			$state.go('user.front_page').then(function(){
				navFootVm.hideNavAni = false;
				navFootVm.loaderGif = '../../assets/img/other/solecastlogo.svg';
			})
		}

	}// eo NavFootCtrl
})() // EO fcn