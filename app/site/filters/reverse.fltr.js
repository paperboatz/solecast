
(function () {
	angular
    	.module('weatherApp')
    	.filter('Reverse', ReverseFilter);

	function ReverseFilter() {
	    return function(inputItems) {
	    	return inputItems.slice().reverse();
	    }
	}
})();
