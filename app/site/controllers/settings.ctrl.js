(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('SettingsCtrl', SettingsCtrl);

	function SettingsCtrl(SettingSrv, $state, ApiService){
		var settingsVm = this;

		//Loader
		settingsVm.rainSvg = '../../assets/img/conditions_svg/raincondWhite.svg';
		settingsVm.snowSvg = '../../assets/img/conditions_svg/snowcondWhite.svg';
		settingsVm.clearSvg = '../../assets/img/conditions_svg/clearcondWhite.svg';

		settingsVm.hours = SettingSrv.hours;
		settingsVm.zip = SettingSrv.zip;
		settingsVm.conversion = SettingSrv.conversion;

		settingsVm.updatedHours = '';
		settingsVm.updatedZip = '';
		settingsVm.updatedTemp = '';

		settingsVm.loader = false; // shows loader page
		settingsVm.zipError = false; // 

		settingsVm.conversions = [ // populates F & C
			{label:'Celsius',value: 'celsius'},
			{label:'Fahrenheit',value: 'fahrenheit'}
		];

/**
  * Submit triggers updateProfle
  * Take values from form and... 
  * triggers fcn to change the names in service 
*/

		settingsVm.updateProfile = function() {

			var zip = settingsVm.zip;

			(function getZip(){
				ApiService.request('/geo/zipcode', {zip}, 'GET')
				.then(function(res){

					console.log(res);
					var zipLatLong = res.data.results[0].geometry.location;
					console.log(zipLatLong);

					/** If the zip code they entered is invalid(return no results)
					    then show the zip not valid error in html
					  * If it is valid, then continue with the fcns. 
					*/
					if (!zipLatLong){
						settingsVm.zipError = true;
						console.log('Error - Not valid zipcode geo')
					} else {
						console.log('No Error - Changing hours, zip, conversion ');
						settingsVm.updateServiceZip(settingsVm.zip, zipLatLong);
						settingsVm.updateServiceHours(settingsVm.hours);
						settingsVm.updateServiceTemp(settingsVm.conversion);
						settingsVm.loader = true;
						$state.go('user.front_page');
					}
				})
			})();
	
		} // update profilezip

/**
  * Triggers Service to change hours
  * Then restates new hour
*/
		settingsVm.updateServiceHours = function(hourName){
			SettingSrv.ChangeHour(hourName);
			settingsVm.hours = SettingSrv.hours;
			console.log('updated hours');
		}

/**
  * Triggers Service to changes zip
  * Then restates new zip
*/
		settingsVm.updateServiceZip = function(zip, latLong){
			SettingSrv.ChangeZip(zip, latLong);
			settingsVm.zip = SettingSrv.zip;
			console.log('updated zip');
			console.log(settingsVm.zip);
		}

/**
  * Triggers Service to Change Temp to Fahrenheit
  * Then restates new conversion 
*/

		settingsVm.updateServiceTemp = function(updateTemp){
			console.log(updateTemp);
			SettingSrv.ChangeTemp(updateTemp);
			settingsVm.conversion = SettingSrv.conversion;
			console.log('updated conversion');
		}

	}// eo ProfileCtrl

})();


// Notes

// Scripts execute from top to bottom
// at first page load, the original city name retrieved from service
// after submit form, new value goes to changedCity fcn
// triggering updateServiceCity fcn
// it triggers ChangeCity in SettingSrv
// changing the orignal value to new value
// then restates new value, by two way binding
// this value persists as we go from page to page

