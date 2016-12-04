// *
//   * user-add-shoe.html
//   * user-edit-shoe.html

(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('ShoeCtrl', ShoeCtrl);

	function ShoeCtrl(ShoeSrv, ApiService, $stateParams, store){ 

		var shoeVm = this;
		shoeVm.addShoe = addShoe;
		shoeVm.shoe = {};
		shoeVm.updateShoe = updateShoe;
/**
=============== ADD SHOE SETUP ===============
*/
	
		shoeVm.pickColor;
		shoeVm.firstColor = '#009DC1';
		shoeVm.secondColor = '#93013C';
		shoeVm.thirdColor = '#804615';

		//Shoe types drop down label
		shoeVm.types = [
			{label:'Boots',value:'boots'},
			{label:'Clog',value:'clog'},
			{label:'Dress Shoe',value:'dress shoe'},
			{label:'Flats',value:'flats'},
			{label:'Heels',value:'heels'},
			{label:'Sandles',value:'sandles'},
			{label:'Sneakers',value:'sneakers'},
			{label:'Other',value:'other'}
		];

		// Color Drop Down Label
		shoeVm.colornums = [
			{label:'1',value:'1'},
			{label:'2',value:'2'},
			{label:'3',value:'3'}
		];

		// If user is logged in (token is in local storage)
		// then set the user_id to token
		// if no token (not logged in, sandbox mode), fill in the userId with "notLoggedIn"
		if (store.get('profile')) {
			shoeVm.profile = store.get('profile');
			shoeVm.user_id = shoeVm.profile.user_id;
			console.log('there is token to adding shoe: ' + shoeVm.user_id);
		} else {
			shoeVm.user_id = 'notLoggedIn';
			console.log('there is no token' + shoeVm.user_id);
		}

/**
=============== GET ALL SHOE ===============
*/
		ShoeSrv.getShoes()
			.then (function(res){
				console.log(res);
			shoeVm.allShoeData = res;
			return res;
		});


		// Color Thumbnail Drop Down
		// Depending on which option, how many color thumbail shows
		shoeVm.showOneColor = function(){
			if (shoeVm.pickColor >= 1) {
				return true;
			} else { 
				return false;
			}
		}

		shoeVm.showTwoColor = function(){
			if (shoeVm.pickColor >= 2) {
				return true;
			} else { 
				return false;
			}
		}

		shoeVm.showThreeColor = function(){
			if (shoeVm.pickColor == 3) {
				return true;	
			} else { 
				return false;
			}
		}

/**
=============== ADD SHOE ===============
*/

		function addShoe(){

			var tempArray = [];
			var condArray = [];
			var colorsArray = [];

			// conditions to keywords // 

			if (shoeVm.any == true){
				condArray.push('snow');
				condArray.push('rain');
				condArray.push('clear');
			} else {
				if (shoeVm.snow == true){
				condArray.push('snow')
				}
				if (shoeVm.rain == true){
				condArray.push('rain')
				}
				if (shoeVm.clear == true){
				condArray.push('clear')
				}
			}

			// temperature to keywords // 
			
			if (shoeVm.all == true){
				tempArray.push('hot');
				tempArray.push('warm');
				tempArray.push('cool');
				tempArray.push('cold');
			} else {
				if (shoeVm.hot == true){
					tempArray.push('hot')
				}
				if (shoeVm.warm == true){
					tempArray.push('warm')
				}
				if (shoeVm.cool == true){
					tempArray.push('cool')
				}
				if (shoeVm.cold == true) {
					tempArray.push('cold')
				}
			}
			
			var shoes = {
				name: shoeVm.name,
				type: shoeVm.type,
				brand: shoeVm.brand,
				description: shoeVm.description,
				conditions: condArray,
				temperature: tempArray,
				colors: [shoeVm.firstColor, shoeVm.secondColor, shoeVm.thirdColor],
				userid: shoeVm.user_id
			};

			console.log(shoes);
			// call Shoe Service not itself
			ShoeSrv.addShoe(shoes);
			
		} // eo add shoe


/**
=============== UPDATE SHOE ===============
*/
		function updateShoe(){

			console.log('clicked updating Shoe');
			
			var tempArray = [];
			var condArray = [];
			var colorsArray = [];

/**
  * Conditions convert to keywords 
*/

			if (shoeVm.cond.any == true){
				condArray.push('snow');
				condArray.push('rain');
				condArray.push('clear');
			} else {
				if (shoeVm.cond.snow == true){
				condArray.push('snow')
				}
				if (shoeVm.cond.rain == true){
				condArray.push('rain')
				}
				if (shoeVm.cond.clear == true){
				condArray.push('clear')
				}
			} 

/**
  * Temperature convert to keywords 
*/
			if (shoeVm.temp.all == true){
				tempArray.push('hot');
				tempArray.push('warm');
				tempArray.push('cool');
				tempArray.push('cold');
			} else {
				if (shoeVm.temp.hot == true){
					tempArray.push('hot')
				}
				if (shoeVm.temp.warm == true){
					tempArray.push('warm')
				}
				if (shoeVm.temp.cool == true){
					tempArray.push('cool')
				}
				if (shoeVm.temp.cold == true) {
					tempArray.push('cold')
				}
			}


			var updateShoe = {
				name: shoeVm.name,
				type: shoeVm.type,
				brand: shoeVm.brand,
				description: shoeVm.description,
				conditions: condArray,
				temperature: tempArray,
				colors: [shoeVm.firstColor, shoeVm.secondColor, shoeVm.thirdColor],
				userid: shoeVm.user_id
			};

			ShoeSrv.updateShoe(updateShoe, $stateParams.shoeId);
		
		} // EO of update shoe			

	 	shoeVm.shoeId = $stateParams.shoeId; 

/**
=============== POPULATING EDIT SHOE PARAMETERS ===============
*/
		if($stateParams.shoeId != undefined){
			
			ShoeSrv.getShoe($stateParams.shoeId)
			
			.then(function(res){

				console.log(res);
	
				shoeVm.returnedShoe = res.data.shoe;
				shoeVm.name = shoeVm.returnedShoe[0].name;
				shoeVm.brand = shoeVm.returnedShoe[0].brand;
				shoeVm.description = shoeVm.returnedShoe[0].description;
				shoeVm.conditions = shoeVm.returnedShoe[0].conditions[0];
				shoeVm._id = shoeVm.returnedShoe[0]._id;
				shoeVm.firstColor = shoeVm.returnedShoe[0].colors[0];
				shoeVm.secondColor = shoeVm.returnedShoe[0].colors[1];
				shoeVm.thirdColor = shoeVm.returnedShoe[0].colors[2];

				console.log(shoeVm.returnedShoe);

/**
  * Populating Shoe Type
*/
				for(var index in shoeVm.types){
					if(shoeVm.returnedShoe[0].type == shoeVm.types[index].value){
						console.log('setting shoe type');
						shoeVm.type = shoeVm.types[index].value;
					}
				}

/**
  * POPULATING COLOR THUMBS

  * If default colors are found in colorArray
    will determine how many colors show - using ng-model 
  * If #804615 not found, then the user has changed all 3 colors
  * if #93013C is not found, then user has changed 2 colors
  * else, they default has only changed 1 color 
  * labels are in strings, so must put the number back into strings
*/
				var colorArray = shoeVm.returnedShoe[0].colors;
				console.log(colorArray);

				if (!colorArray.includes("#804615")){
					console.log("user has changed all 3 colors");
					shoeVm.pickColor = '3';
				} else if (!colorArray.includes("#93013C")) {
					console.log('user has changed 2nd color');
					shoeVm.pickColor = '2';
				} else {
					console.log('default, user has chosen no color');
					shoeVm.pickColor = '1';
				}

/**
  * Populating Temperature check boxes
*/	
				shoeVm.temp = {
					hot: false,
					warm: false,
					cool: false,
					cold: false,
					all: false
				};

				// temperature to keywords
				for (var i = 0; i < shoeVm.returnedShoe[0].temperature.length; i++){
					if (shoeVm.returnedShoe[0].temperature[i] == 'hot'){
						shoeVm.temp.hot = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] == 'warm'){
						shoeVm.temp.warm = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] == 'cold'){
						shoeVm.temp.cold = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] == 'cool'){
						shoeVm.temp.cool = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] == 'all'){
						shoeVm.temp.all = true;
					}
				}

/**
  * Populating Conditions radio boxes
*/
				shoeVm.cond = {
					snow: false,
					rain: false,
					clear: false,
					any: false
				};

				// Conditions to keywords // 
				for (var i = 0; i < shoeVm.returnedShoe[0].conditions.length; i++){
					if (shoeVm.returnedShoe[0].conditions[i] == 'snow'){
						shoeVm.cond.snow = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] == 'rain'){
						shoeVm.cond.rain = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] == 'clear'){
						shoeVm.cond.clear = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] == 'any'){
						shoeVm.cond.any = true;
					}
				} //eo For conditions to keywords

			}) // E0 .then $stateParams.shoeId != undefined
		} //eo if $stateParams.shoeId != undefined

/**
=========== DELETE SHOE ===========
*/
		shoeVm.deleteShoe = deleteShoe;

		function deleteShoe(){
			console.log('deleted')
			// get shoeId from route params
			var shoeId = $stateParams.shoeId;
			ShoeSrv.deleteShoe(shoeId);
		}
	
	} // eo ShoeCtrl
})();





