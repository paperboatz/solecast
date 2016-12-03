(function(){ 
	angular
		.module('weatherApp')
		.service('ApiService', ApiService);

	function ApiService($http) { 
		var self = this;

		var BASE_URL = '/api';

		self.request = request;
		function request(endpoint, data, method){
			if (method == 'POST'){
				data = JSON.stringify(data);
				return $http.post(BASE_URL + endpoint, data)
			} 
			else if (method == 'GET'){ 
				data = formatGetData(data);
				return $http.get(BASE_URL + endpoint+data);
			} 
			else if(method == 'PUT'){
                data = JSON.stringify(data);
                console.log(data);
                return $http.put(BASE_URL + endpoint, data);
            }
            else if(method == 'DEL'){
				return $http.delete(BASE_URL + endpoint);
			}
		}// eo function REQ

		function formatGetData(data){
            var data_string = '?';
            for(item in data){
                if(data_string == '?'){
                    data_string += item+'='+encodeURIComponent(data[item]);
                }
                else{
                    data_string +='&'+item+'='+encodeURIComponent(data[item]);
                }
            }
            if(data_string == '?'){return '';}
            return data_string;
        }

	} // eo apiService
})();

