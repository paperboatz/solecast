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

		// Shoe Images
		user.boots = '../../assets/img/shoe_svg/boot.svg';
		user.clog = '../../assets/img/shoe_svg/clog.svg';
		user.dressShoe = '../../assets/img/shoe_svg/dressShoe.svg';
		user.flats = '../../assets/img/shoe_svg/flats.svg';
		user.heels = '../../assets/img/shoe_svg/heels.svg';
		user.other = '../../assets/img/shoe_svg/other.svg';
		user.sandles = '../../assets/img/shoe_svg/sandles.svg';
		user.sneakers = '../../assets/img/shoe_svg/sneaker.svg';

		// Condition images
		user.snowImg = '../../assets/img/conditions_svg/snowcondFront.svg';
		user.rainImg = '../../assets/img/conditions_svg/rainFront.svg';

		// Bindings 
		user.date = new Date();
		user.completeWeatherObj = {};
		user.hours = SettingSrv.hours; // determines hr range of forcast
		user.latLong = SettingSrv.latLong;

		var weatherArray = [];
		var weatherTempArray = [];

		// Location btn to reload page to bring geolocation perm
		user.reloadPage = function(){
			console.log('Page Reload to bring back GeoLocation Perm');
			$window.location.reload();
		};

/**
====== Change Thumbnail colors =====
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
	* Check if srv to see if latLong is empty/false, which no submit in srv yet
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
/**
====== Get Current Location from Geocoder Api =====
*/

		function getGeo(){

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
			} // eo getGeo

			getGeo();
		
/**
=== GET THE WEATHER DATA FROM Darksky API IN SERVER ======
  * pass {latitude, longitude} resolved in app.js
  * to GET request. return res is data sent back. 
*/

		function getWeather(){
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
				user.currentCond = res.data.hourly.data[0].icon;
				user.hours = SettingSrv.hours;
				
				console.log('current cond: '+user.currentCond);
				
				for (var i = 0; i < user.hours; i++){
					var condition = res.data.hourly.data[i].icon;
					weatherArray.push(condition);

					// Retrieve Temperature & Round up
					var weatherTemp = res.data.hourly.data[i].apparentTemperature;
					var weatherTempRound = Math.round(weatherTemp);
					weatherTempArray.push(weatherTempRound);
				} // eo hour/temp Loop

				// Get max temperature of the Array
				var maxNum = getMaxOfArray(weatherTempArray);

				function getMaxOfArray(numArray) {
  					return Math.max.apply(null, numArray);
				}

				console.log(weatherArray);
				console.log(weatherTempArray);
				
				var fahrenhietIcon = '°F';
				var celsiusIcon = '°C';
				user.currentTemp = weatherTempArray[0] + celsiusIcon;
				var conversion = SettingSrv.conversion; // taking default conversion
				var currentTempOnly = weatherTempArray[0]; // current degrees in C
				user.maxTemp = maxNum;
				user.converter = celsiusIcon;

// CONVERTING °C to °F & replacing symbol
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

				console.log('current temp: ' + user.currentTemp);

				// condense API parameters & define
				// API default conditions: clear-day, clear-night, rain, snow, sleet, wind, 
				// fog, cloudy, partly-cloudy-day, or partly-cloudy-night. 
				var weatherObj = [];

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

				console.log(weatherObj);
				user.elements = weatherObj.toString(); // displays current cond as string, not array

				return user.completeWeatherObject = {
					currentTemp: currentTempOnly,
					conditions: weatherObj, 
					maxTemp: maxNum
				};// eo completeWeatherObj 
			})
			.then(function(res){

				console.log(res);

				user.selectFilter = selectFilter;

				var weatherTempTrans = [];
				var weatherRain = false; 
				var weatherClear = false;
				var weatherSnow = false;
				var shoeRain = false;
				var shoeClear = false;
				var shoeSnow = false; 
				
				for (var i = 0; i < res.conditions.length; i++){

					var weatherCon = res.conditions[i];

					if (weatherCon == 'rain'){
						weatherRain = true;
						console.log('There is weatherRain');
					}
					else if (weatherCon == 'clear'){
						weatherClear = true;
						console.log('There is WeatherClear');
					}
					else if (weatherCon == 'snow'){
						weatherSnow = true;
						console.log('There is weatherSnow');
					} else {
						console.log('none');
					}
				} // eo weather app FOR loop

/**
  *	TRANSLATING WEATHER API TEMP TO KEYWORDS 
*/
				if (res.maxTemp > 28 && res.maxTemp < 75){
  					weatherTempTrans.push('hot');
				}
				if (res.maxTemp > 18 && res.maxTemp <= 28){
					weatherTempTrans.push('warm');
				}
				if (res.maxTemp > 5 && res.maxTemp <= 18){
					weatherTempTrans.push('cool');
				}
				if (res.maxTemp > -50 && res.maxTemp <= 5){
					weatherTempTrans.push('cold');
				}
				
				console.log(weatherTempTrans);

/**
=============== SHOE LOGIC ===============
*/	

/** 
  * Checking User Shoe input conditions
  * Turning shoeRain, shoeClear, shoeSnow true if it finds it in the array
  * After, filter will sort out via true
*/				

				for (var i = 0; i < user.allShoeData.length; i++){
					for (var b = 0; b < user.allShoeData[i].conditions.length; b++){
						var singleEle = user.allShoeData[i].conditions[b];
						if (singleEle == 'rain'){
							shoeRain = true;
						} else if (singleEle == 'clear'){
							shoeClear = true;
						} else if (singleEle == 'snow'){
							shoeSnow = true;
						} else {
							console.log('none')
						}
					} // eo inner loop
				} // eo shoeData Loop

/**
=============== COMBINED CONDITIONS FILTER ===============
*/

			function selectFilter(res){
/** 
  * checks if the contains a keyword like 'rain' 
  * -1 means if it never occurs, so  != -1 means if it does, return true
  * these are global var, so it doesn't take from the shoe.... 
*/
				if (weatherRain == true && shoeRain == true && res.conditions.indexOf('rain') != -1 && weatherTempTrans.indexOf('hot') != -1 && res.temperature.indexOf('hot') != -1){
					console.log('weatherRain & shoeRain match + weatherHot & shoeHot ');
					return true;
				}
				if (weatherRain == true && shoeRain == true && res.conditions.indexOf('rain') != -1 && weatherTempTrans.indexOf('warm') != -1 && res.temperature.indexOf('warm') != -1){
					console.log('weatherRain & shoeRain match + weatherWarm & shoeWarm ');
					return true;
				}
				if (weatherRain == true && shoeRain == true && res.conditions.indexOf('rain') != -1 && weatherTempTrans.indexOf('cool') != -1 && res.temperature.indexOf('cool') != -1){
					console.log('weatherRain & shoeRain match + weatherCool & shoeCool');
					return true;
				}
				if (weatherRain == true && shoeRain == true && res.conditions.indexOf('rain') != -1 && weatherTempTrans.indexOf('cold') != -1 && res.temperature.indexOf('cold') != -1){
					console.log('weatherRain & shoeRain match + weatherCold & shoewCold ');
					return true;
				}
				if (weatherRain == true && shoeRain == true && res.conditions.indexOf('rain') != -1 && res.temperature.indexOf('all') != -1){
					console.log('weatherRain & shoeRain match + shoeAny');
					return true;
				}

/**
  * CLEAR & SHOE TEMP CONDITIONS
*/
				if (weatherClear == true && shoeClear == true && res.conditions.indexOf('clear') != -1 && weatherTempTrans.indexOf('hot') != -1 && res.temperature.indexOf('hot') != -1){
					console.log('weatherClear & shoeClear match + weatherHot & shoeHot');
					return true;
				}
				if (weatherClear == true && shoeClear == true && res.conditions.indexOf('clear') != -1 && weatherTempTrans.indexOf('warm') != -1 && res.temperature.indexOf('warm') != -1){
					console.log('weatherClear & shoeClear match + weatherWarm & shoeWarm');
					return true;
				} 
				if (weatherClear == true && shoeClear == true && res.conditions.indexOf('clear') != -1 && weatherTempTrans.indexOf('cool') != -1 && res.temperature.indexOf('cool') != -1){
					console.log('weatherClear & shoeClear match + weatherCool & shoeCool');
					return true;
				} 
				if (weatherClear == true && shoeClear == true && res.conditions.indexOf('clear') != -1 && weatherTempTrans.indexOf('cold') != -1 && res.temperature.indexOf('cold') != -1){
					console.log('weatherClear & shoeClear match + weatherCold & shoewCold ');
					return true;
				} 
				if (weatherClear == true && shoeClear == true && res.conditions.indexOf('clear') != -1 && res.temperature.indexOf('all') != -1){
					console.log('weatherClear & shoeClear match + shoeALL');
					return true;
				} 

/**
  * SNOW & SHOE TEMP CONDITIONS
*/
				if (weatherSnow == true && shoeSnow == true && res.conditions.indexOf('snow') != -1 && weatherTempTrans.indexOf('hot') != -1 && res.temperature.indexOf('hot') != -1){
					console.log('weatherSnow & shoeSnow match + weatherHot & shoeHot');
					return true;
				} 
				if (weatherSnow == true && shoeSnow == true && res.conditions.indexOf('snow') != -1 && weatherTempTrans.indexOf('warm') != -1 && res.temperature.indexOf('warm') != -1){
					console.log('weatherSnow & shoeSnow match + weatherWarm & shoeWarm');
					return true;
				}
				if (weatherSnow == true && shoeSnow == true && res.conditions.indexOf('snow') != -1 && weatherTempTrans.indexOf('cool') != -1 && res.temperature.indexOf('cool') != -1){
					console.log('weatherSnow & shoeSnow match + weatherCool & shoeCool');
					return true;
				} 
				if (weatherSnow == true && shoeSnow == true && res.conditions.indexOf('snow') != -1 && weatherTempTrans.indexOf('cold') != -1 && res.temperature.indexOf('cold') != -1){
					console.log('weatherSnow & shoeSnow match + weatherCold & shoewCold');
					return true;
				} 
				if (weatherSnow == true && shoeSnow == true && res.conditions.indexOf('snow') != -1 && res.temperature.indexOf('all') != -1){
					console.log('weatherSnow & shoeSnow match && shoeALL');
					return true;
				} 

/**
  * ALL CONDITION & SHOE TEMP CONDITIONS
*/
				// Conditions options: snow, rain, clear, any
				// temp options: hot, warm, cool, cold, all 

				if (res.conditions.indexOf('any') != -1 && weatherTempTrans.indexOf('hot') != -1 && res.temperature.indexOf('hot') != -1){
					console.log('shoeAll + weatherHot & shoewHot ');
					return true;
				}
				if (res.conditions.indexOf('any') != -1 && weatherTempTrans.indexOf('warm') != -1 && res.temperature.indexOf('warm') != -1){
					console.log('shoeAll + weatherWarm & shoewWarm ');
					return true;
				}
				if (res.conditions.indexOf('any') != -1 && weatherTempTrans.indexOf('cool') != -1 && res.temperature.indexOf('cool') != -1){
					console.log('shoeAll + weatherCool & shoeCool');
					return true;
				}
				if (res.conditions.indexOf('any') != -1 && weatherTempTrans.indexOf('cold') != -1 && res.temperature.indexOf('cold') != -1){
					console.log('shoeAll + weatherCold & shoewCold ');
					return true;
				}
				if (res.conditions.indexOf('any') != -1 && res.temperature.indexOf('all') != -1){
					console.log('shoeAll + shoeAny');
					return true;
				}
			} // eo Select filter

			return res;
		}) // eo .then conditions
		.then(function(res){

/**
======== ANIMATIONS =============
*/ 
			
			user.rain = false;
			user.snow = false;
			user.clear = false;
			var weatherCond = res.conditions; 
/*
====== RAIN ANI ========
* https://codepen.io/wpaix/pen/OVXymj
* loop creates multiple rain and snow objects/droplets
* objects are fed continulously into conditional spawn
* function uses this obj to append css prop to css & html template
* clear cond is outside of loop bc we want to execute once
* it is a ng show with svg in html already
*/ 

			var App = { numberOfDroplets: 30 };
			var i = 0;

			while( i < App.numberOfDroplets ) {    

				function Droplet(){};
				Droplet.prototype.left = () => parseInt( Math.random() * 100 );
				Droplet.prototype.top = function(y, w) {
				  let yCord = y + ( this.opacity * w );
				  return yCord;
				};
				Droplet.prototype.opacity = () => parseFloat(Math.random().toFixed(1));
				Droplet.prototype.scale = function(x){
				  let scale = this.opacity * x;
				  return scale;
				};
				Droplet.prototype.duration = () => 1 + parseFloat(Math.random().toFixed(2));

				// create snowDroplet & add it onto object
				const snowDroplet = new Droplet();
				snowDroplet.left = snowDroplet.left();
				snowDroplet.opacity = snowDroplet.opacity();
				snowDroplet.top = snowDroplet.top(20, 60);
				snowDroplet.scale = snowDroplet.scale(0.5);
				snowDroplet.duration = snowDroplet.duration();
				snowDroplet.delay = snowDroplet.duration / 4 ;

				const rainDroplet = new Droplet();
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

/*
 * CONDITIONAL HERO IMAGE
*/
			if (weatherCond.includes('clear') && !weatherCond.includes('rain') && !weatherCond.includes('snow')) {
				user.clear = true;
			} else if (weatherCond.includes('snow')){
		  		user.snow = true;
		  	} else if (weatherCond.includes('rain')){
		  		user.rain = true;
		  	}

/**
  * FUNCTION Clear, Rain, Snow Ani 
  * https://codepen.io/wpaix/pen/OVXymj
  * 
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

		})}// eo .then conditions & getWeather
		getWeather(); // activates the GET darksky API, declaration down here because not enough time to retrieve databack
	}// eo userCtrl
})();