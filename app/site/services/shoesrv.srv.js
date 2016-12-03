

/**
=== SHOE SERVICE======
*/

/**
  * Used with Shoe Ctrl for add/edit/dash pages
*/

(function(){

	angular
		.module('weatherApp')
		.service('ShoeSrv',ShoeSrv);

	function ShoeSrv(ApiService, $state, store){

		var self = this;

		// public variables
		self.shoes = [];

		// public Functions 
		self.addShoe = addShoe;
		self.getShoes = getShoes;
		self.getShoe = getShoe;
		self.deleteShoe = deleteShoe;
		self.updateShoe = updateShoe;

  		// if user is logged in (nothing in local storage)
		// then set the user_id to be used when adding shoe
		// if not, fill in the userId with "notLoggedIn"
		if (store.get('profile')) {
			self.profile = store.get('profile');
			var user_id = self.profile.user_id;
			console.log(user_id);
		} else {
			var user_id = 'notLoggedIn';
		}

/**
=== GET SHOES ======
*/
		function getShoes(){
			return ApiService.request('/shoes', {user_id}, 'GET')
			.then (function(res){
				console.log(res.data.shoe);
				self.shoes = res.data.shoe;
				return res.data.shoe;
			}, function(res){
				//error callback
				console.log(res);
				return;
			})
		}

/**
  * Retrieves Data of one shoe 
*/
		function getShoe(shoeId){
			return ApiService.request('/shoes/'+shoeId,{},'GET');
		}

/**
=== POST SHOE ======
*/
		function addShoe(shoe){
			ApiService.request('/shoes/newshoe', shoe, 'POST')
			.then(function(res){
				console.log(res);
				if(res.status === 200){
					self.shoes.push(res.data.shoe);
					$state.go('user.dash')
				}
			})
		} // eo addShoe

/**
=== PUT SHOE ======
*/
		function updateShoe(shoe, shoeId){
			ApiService.request('/shoes/'+shoeId, shoe, 'PUT')
			.then(function(res){
				$state.go('user.dash')
				console.log(res);
				console.log('going to update');
			})
		}//eo updateShoe

/**
===  DELETE SHOE ======
*/
		function deleteShoe(shoeId){
			console.log('deleting: ' + shoeId);
			ApiService.request('/shoes/'+shoeId,{},'DEL')
			.then(function(res){
				console.log(res);
				if(res.status === 200){
					console.log('shoe deleted from here')
					// self.removeShoe(shoeId);
					$state.go('user.dash')
					.then(function(){
						console.log('you are going to reload')
						$state.reload();
					})
				}
			})
		}// eo deleteShoe

	}// eo ShoeSrv


})();