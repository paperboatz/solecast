(function(){

	angular
    	.module('weatherApp')
    	.filter('Fahrenheit', FahrenheitFltr);

	function FahrenheitFltr() {
	    return function(celsius) {
	    	 var farenheit = celsius * 1.8 + 32;
             return farenheit + '°F';
	    }
	}
})();