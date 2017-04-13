/**
  * user-front.html
*/

(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('FrontCtrl', FrontCtrl);

	function FrontCtrl(ShoeSrv, SettingSrv, $scope, $state, $http, ApiService, locoFrontObj, $window){
		var user = this;

		console.log(this);

		// Shoe Images
		user.boots = '../../assets/img/shoe_svg/boot.svg';
		user.clog = '../../assets/img/shoe_svg/clog.svg';
		user.dressShoe = '../../assets/img/shoe_svg/dressShoe.svg';
		user.flats = '../../assets/img/shoe_svg/flats.svg';
		user.heels = '../../assets/img/shoe_svg/heels.svg';
		user.other = '../../assets/img/shoe_svg/other.svg';
		user.sandles = '../../assets/img/shoe_svg/sandles.svg';
		user.sneakers = '../../assets/img/shoe_svg/sneaker.svg';

		// Condition Images
		user.snowImg = '../../assets/img/conditions_svg/snowcondFront.svg';
		user.rainImg = '../../assets/img/conditions_svg/rainFront.svg';

		// Bindings 
		user.date = new Date();
		user.completeWeatherObj = {};
		user.hours = SettingSrv.hours; // determines hr range of forcast
		user.latLong = SettingSrv.latLong;
		user.hideShoes = true;

		var weatherArray = [];
		var weatherTempArray = [];

/**
====== Change Thumbnail Colors =====
*/
		ShoeSrv.getShoes()
			.then (function(res){
				console.log(res);
				user.allShoeData = res;
				return res;
		})
		.then(function(result){

			// Changing the thumbnail colors
			for (var i = 0; i < result.length; i++ ) {
				if (result[i].colors[0] == "#009DC1"){
					result[i].colors[0] = 'transparent';
				}
				if (result[i].colors[1] == "#93013C"){
					result[i].colors[1] = 'transparent';
				} 
				if (result[i].colors[2] == "#804615"){
					result[i].colors[2] = 'transparent';
				}
			}

			return result;
		});

		$scope.$watch(function(){
	    	return ShoeSrv.shoes;
		}, function (newValue) {
			if(ShoeSrv.shoes.length > 0){
			    user.shoes = ShoeSrv.shoes;
			    user.is_shoes = true;
			}
		});

/**
=============== API CALL TO WEBSITE  ===============
*/

/**
	* Check if srv to see if latLong is empty/false, which means no submit in srv yet
	  will grab current lat/long from app.js resolve locoFrontObj
	* If true, means submition in srv,
	  grab the lat/long from srv
	* lat/long injected in getWeather
*/
		if (!SettingSrv.latLong) {
			var latitude = locoFrontObj.latitude;
			var longitude = locoFrontObj.longitude;
			console.log('If zip is empty then, lat & long' + latitude + ' ' + longitude);
		} else {
			var latitude = SettingSrv.latLong.lat;
			var longitude = SettingSrv.latLong.lng;
			console.log('Zip from SettingSrv, grabing lat and long');
		}


// ====== Get Current Location from Geocoder Api =====

		(function getGeo(){

				ApiService.request('/geo/geolocation', {latitude, longitude}, 'GET')
				.then(function(res){
					console.log(res);
					if(res.status === 200){
						console.log('Sucess from API ');
						return res;
					} else{
						console.log('Geo failed from API ');
					}
				})
				.then(function(res){
					console.log(res);

				// Formats Google api, return city, country and zip
					var level_1; // will be country 
		            var level_2; // will be city
		            var level_3; // will be zip
		            var length_1 = res.data.results.length;
		          
		            for (var x = 0; x < length_1; x++){
		            	var length_2 = res.data.results[x].address_components.length;
		              for (var y = 0; y < length_2; y++){
		                  var type = res.data.results[x].address_components[y].types[0];
		                    if ( type === "administrative_area_level_1") {
		                      level_1 = res.data.results[x].address_components[y].long_name;
		                      if (level_3) break;
		                    } else if (type === "locality"){
		                      level_2 = res.data.results[x].address_components[y].long_name;
		                      if (level_2) break;
		                    } else if (type === "postal_code"){
		                    	var postalCode = res.data.results[x].address_components[y].long_name;
		                      	if (postalCode.length > 5 ){ // only return a valid zip (5 US or 6/canada)
		                      		postalCode = postalCode.replace(/\s+/g, '');
		                      		level_3 = postalCode;
		                      	}
		                      	if (level_1) break;
		                    }
		                }
		            } // eo formating 

		           	user.cityProv = level_2 + ', ' + level_1;
	
		           	/** To fill zipcode in settings
		           	  * On first load, SettingSrv is empty
		           	    when empty, declare SettingSrv with the current geolocation zipcode
		           	    so zipcode input will be filled in Settings
		           	  * If it isn't empty = user submiitted in Settings
		           	  	then, do nothing. SettingsCtrl will set the input to persist in SettingSrv
		           	*/ 
					if (!SettingSrv.zip){
						SettingSrv.zip = level_3;
					}	

		           	 console.log(user.cityProv);
				}) // eo .then
			})(); // eo getGeo
		
/**
=== GET THE WEATHER DATA FROM Darksky API IN SERVER ======
  * pass {latitude, longitude} resolved in app.js
  * to GET request. return res is data sent back. 
*/

		(function getWeather(){
			return ApiService.request('/geo', {latitude, longitude}, 'GET')
			.then (function(res){
				console.log(res);
				console.log('Sucess Getting weather from Api');
				return res
			}, function(res){
				console.log(res);
				console.log('Error getting API');
				return;
			})
			.then(function(res){
				var hourly = res.data.hourly.data[0];
				var weatherObj = [];

				for (var i = 0; i < user.hours; i++){
					var condition = res.data.hourly.data[i].icon;
					weatherArray.push(condition);

					// Retrieve Temperature & Round up
					var weatherTemp = res.data.hourly.data[i].apparentTemperature;
					var weatherTempRound = Math.round(weatherTemp);
					weatherTempArray.push(weatherTempRound);
				} // eo hour/temp Loop
				
				var fahrenhietIcon = '°F';
				var celsiusIcon = '°C';
				var conversion = SettingSrv.conversion; // taking default conversion
				var currentTempOnly = weatherTempArray[0]; // current degrees in C
	
				user.elements = weatherObj; 
				user.currentCond = res.data.hourly.data[0].icon;
				user.hours = SettingSrv.hours;
				user.currentTemp = weatherTempArray[0] + celsiusIcon;			
				user.converter = celsiusIcon;

				// Get max tempof the Array
				function getMaxOfArray(numArray) {
  					return Math.max.apply(null, numArray);
				}

				var maxNum = getMaxOfArray(weatherTempArray);
				user.maxTemp = maxNum;	

// Converting °C to °F & replacing symbol
// Uses Profile Service to grab changed values
				if (conversion === 'fahrenheit'){
					var tempOnly = user.currentTemp.replace(/°C/g,'');
					var fahrenheit = Math.round(tempOnly * 1.8 + 32);
					user.maxTemp = Math.round(maxNum * 1.8 + 32); // Max Temp Fahrenhiet
					user.converter = fahrenhietIcon; // Max Temp Fahrenhiet Icon
			        user.currentTemp = fahrenheit + fahrenhietIcon; // Current Temp Fahrenhiet
			        console.log('converting to fahrenheit')
				} else {
					console.log('remained celsius');
				}

// condense API parameters & define
// API default conditions: clear-day, clear-night, rain, snow, sleet, wind, 
// fog, cloudy, partly-cloudy-day, or partly-cloudy-night. 

				if (weatherArray.includes('rain')){
					weatherObj.push('rain');
				}
				if (weatherArray.includes('thunderstorm')){
					weatherObj.push('rain');
				}
				if (weatherArray.includes('sleet')){
					weatherObj.push('snow');
				}
				if (weatherArray.includes('snow')){
					weatherObj.push('snow');
				}
				if (!weatherArray.includes("rain") && !weatherArray.includes("snow")){
					weatherObj.push('clear');
				}
				
				return user.completeWeatherObject = {
					currentTemp: currentTempOnly,
					conditions: weatherObj, 
					maxTemp: maxNum
				};// eo completeWeatherObj 
			})
			.then(function(res){

			    user.selectFilter = selectFilter;
				var wTemp = '';
				var wCond = res.conditions;

/**
  *	TRANSLATING WEATHER API TEMP TO KEYWORDS 
*/
				if (res.maxTemp > 28 && res.maxTemp < 75){
  					wTemp = 'hot';
				}
				if (res.maxTemp > 18 && res.maxTemp <= 28){
					wTemp = 'warm';
				}
				if (res.maxTemp > 5 && res.maxTemp <= 18){
					wTemp = 'cool';
				}
				if (res.maxTemp > -50 && res.maxTemp <= 5){
					wTemp = 'cold';
				}		

/**
=============== SHOE & WEATHER CONDITIONS FILTER ===============
*/
// select Filter takes 1 item(shoe) from ng-repeat and checks if true, then  it will show
// we compare each element in sCond array to wCond
// then compare sTemp array to wTemp array
// if both comparisions are true, then the shoe will show 

				
				function selectFilter(shoe){

					var sCond = shoe.conditions;
					var sTemp = shoe.temperature;

					function compareShoeToWeather(shoeCond, weatherCond){
					  var match = false;
					  shoeCond.forEach(function(element, index) {
					  	if (weatherCond.indexOf(element) !== -1)
					  		return match = true; 
					   });

					  return match
					}

					if (compareShoeToWeather(sCond, wCond) && compareShoeToWeather(sTemp, wTemp)){
					  	console.log(sCond + ' ' + wCond + ' ' + sTemp +' '+ wTemp);
						return true;
					  } else {
					  	console.log('no match');
					  	return false;
					  }
				}// eo Select filter

			// All the shoes were showing in html before javascript loaded, so there was a blip
			// hideShoes to true initialy, then one selectFilter is done, set hideShoes to false
			// How did I find out? Use breakpoints in dev tools to see what was being loaded first
			user.hideShoes = false;

			return res;
		}) // eo .then conditions
		.then(function(res){

/**
============= ANIMATIONS =============
*/ 
			
			user.rain = false;
			user.snow = false;
			user.clear = false;
			var weatherCond = res.conditions; 

/*
 * ===== WEATHER ANIMATION ===== 
*/
			if (weatherCond.includes('clear') && !weatherCond.includes('rain') && !weatherCond.includes('snow')) {
				user.clear = true;
			} else if (weatherCond.includes('snow')){
		  		user.snow = true;
		  	} else if (weatherCond.includes('rain')){
		  		user.rain = true;
		  	}
/*
====== RAIN ANI ========
* https://codepen.io/wpaix/pen/OVXymj
* loop creates multiple rain and snow objects/droplets
* objects are fed continulously into conditional spawn
* function uses this obj to append css prop to css & html template
* clear cond is outside of loop bc we want to execute once
* it is a ng-show with svg in html already
*/ 

			function Droplet(){};
			Droplet.prototype.left = function(){ 
				return parseInt( Math.random() * 100 );
			};
			Droplet.prototype.top = function(y, w) {
			   return y + ( this.opacity * w );
			};
			Droplet.prototype.opacity = function(){
				return parseFloat(Math.random().toFixed(1));
			};
			Droplet.prototype.scale = function(x){
			   return this.opacity * x;
			};
			Droplet.prototype.duration = function(){
				return 1 + parseFloat(Math.random().toFixed(2));
			};

			var App = { numberOfDroplets: 30 };
			var i = 0;

			if (user.rain === true) { 

				while( i < App.numberOfDroplets ) {    

				// create snowDroplet & add it onto object
				var snowDroplet = new Droplet();
				snowDroplet.left = snowDroplet.left();
				snowDroplet.opacity = snowDroplet.opacity();
				snowDroplet.top = snowDroplet.top(20, 60);
				snowDroplet.scale = snowDroplet.scale(0.5);
				snowDroplet.duration = snowDroplet.duration();
				snowDroplet.delay = snowDroplet.duration / 4 ;

				var rainDroplet = new Droplet();
				rainDroplet.left = rainDroplet.left();
				rainDroplet.opacity = rainDroplet.opacity();
				rainDroplet.top = rainDroplet.top(45, 35);
				rainDroplet.scale = rainDroplet.scale(2);
				rainDroplet.duration = rainDroplet.duration();
				rainDroplet.delay = rainDroplet.duration;

	/*
	* CONDITIONAL SPAWN LOOP
	*/
			  	if (weatherCond.includes('rain') && weatherCond.includes('snow')){
			  		executeRain(rainDroplet);
			  		executeSnow(snowDroplet);
			  		console.log('executing rain & snow animation');
			  	} else if (weatherCond.includes('rain')){
			  		executeRain(rainDroplet);
			  		console.log('executing rain animation');
			  	} else if (weatherCond.includes('snow')){
			  		executeSnow(snowDroplet);
			  		console.log('executing snow animation');
			  	}
			  	i++;
			  } // eo droplet loop
		    }


/**
  * FUNCTION Clear, Rain, Snow Ani 
  * https://codepen.io/wpaix/pen/OVXymj
*/
		  	function executeRain(spawnDroplet){
		    	$('.jumbotron').append('<div class="droplet"><div class="flying"></div><div class="splashing"></div></div>');
					
			      var $droplet = $('body .droplet').last();
			      var $flying = $droplet.find('.flying');
			      var $splashing = $droplet.find('.splashing');

			      $droplet.css({
			          	left: spawnDroplet.left + '%',
			        	top: spawnDroplet.top + '%',
			        	transform: 'scale(' + spawnDroplet.scale + ')',
			        	opacity: spawnDroplet.opacity
			      });
			      $flying.css({
			        	animation: spawnDroplet.duration + 's flying 4 linear',
			        	'animation-delay': spawnDroplet.delay + 's',
			      });
			      $splashing.css({
			        	animation: spawnDroplet.duration + 's splashing 4 linear',
				        'animation-delay': (spawnDroplet.duration+spawnDroplet.delay) + 's',
			      });
		  	} // eo execute rain

		  	function executeSnow(spawnDroplet){
				  $('body').append('<div class="snowDroplet"><div class="snowFlying"></div><div class="snowSplashing"></div></div>');
					
			      var $snowDroplet = $('body .snowDroplet').last();
			      var $snowFlying = $snowDroplet.find('.snowFlying');
			      var $snowSplashing = $snowDroplet.find('.snowSplashing');

			   	 $snowDroplet.css({
			          	left: spawnDroplet.left + '%',
			        	top: spawnDroplet.top + '%',
			        	transform: 'scale(' + spawnDroplet.scale + ')',
			        	opacity: spawnDroplet.opacity
			      });
			      $snowFlying.css({
			        	animation: spawnDroplet.duration + 's snowFlying 4 linear',
			        	'animation-delay': spawnDroplet.delay + 's',
			      });
			      $snowSplashing.css({
			        	animation: spawnDroplet.duration + 's snowSplashing 4 linear',
				        'animation-delay': (spawnDroplet.duration+spawnDroplet.delay) + 's',
			      });
		  	}// EO execute snow 

		})})()// eo .then conditions & getWeather

	}// eo userCtrl
})();