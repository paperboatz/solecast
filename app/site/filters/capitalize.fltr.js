(function(){

	angular
    	.module('weatherApp')
    	.filter('Capitalize', CapitalizeFilter);

	function CapitalizeFilter() {
	    return function(inputString) {
	    	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
	    }
	}
})();