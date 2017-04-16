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
		shoeVm.thirdColor = '#FFB6C1';

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


/**
=============== COLOR THUMBNAILS ===============
*/
		// Color Thumbnail Drop Down
		// Depending on which option, how many thumbails are shown
		shoeVm.showOneColor = function(){
			if (shoeVm.pickColor >= 1)
				return true;
		}
		shoeVm.showTwoColor = function(){
			if (shoeVm.pickColor >= 2)
				return true;
		}
		shoeVm.showThreeColor = function(){
			if (shoeVm.pickColor == 3)
				return true;
		}

/**
=============== ADDING IDENTIFYING TOKEN ===============
*/
	// If user is logged in (token is in local storage)
	// then set the user_id to token
	// if no token (not logged IN sandbox mode), fill in the userId with "notLoggedIn"
		if (store.get('profile')) {
			shoeVm.profile = store.get('profile');
			shoeVm.user_id = shoeVm.profile.user_id;
			console.log('there is token to adding shoe: ' + shoeVm.user_id);
		} else {
			shoeVm.user_id = 'notLoggedIn';
			console.log('there is no token' + shoeVm.user_id);
		}

/**
=============== GET SHOES ===============
*/

		ShoeSrv.getShoes()
			.then (function(res){
				console.log(res);
			shoeVm.allShoeData = res;
			return res;
		});


/**
=============== ADD SHOE ===============
*/

		function addShoe(){

			console.log('shoe added')

		  	var colorsArray = [];
			var tempArray = [];
			var condArray = [];

			// Color picker //

			// Adding thumbnail colors
			// Adding only the amount that was submitted by label value
			  if (shoeVm.pickColor === '1'){
			      colorsArray = [shoeVm.firstColor];
			  } else if (shoeVm.pickColor === '2') {
			      colorsArray = [shoeVm.firstColor, shoeVm.secondColor];
			  } else {
	     		  colorsArray = [shoeVm.firstColor, shoeVm.secondColor, shoeVm.thirdColor];
			  }

			// conditions to keywords // 

			if (shoeVm.any){
				condArray = ['snow', 'rain', 'clear'];
			} else {
				if (shoeVm.snow){ condArray.push('snow') }
				if (shoeVm.rain){ condArray.push('rain') }
				if (shoeVm.clear){ condArray.push('clear') }
			}

			// temperature to keywords // 
			
			if (shoeVm.all){
				tempArray = ['hot', 'warm', 'cool', 'cold'];
			} else {
				if (shoeVm.hot){ tempArray.push('hot') }
				if (shoeVm.warm){ tempArray.push('warm') }
				if (shoeVm.cool){ tempArray.push('cool') }
				if (shoeVm.cold){ tempArray.push('cold') }
			}
			
			var shoes = {
				name: shoeVm.name,
				type: shoeVm.type,
				brand: shoeVm.brand,
				description: shoeVm.description,
				conditions: condArray,
				temperature: tempArray,
				colors: colorsArray,
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
			
			console.log('shoe updated')

			var tempArray = [];
			var condArray = [];
			var colorsArray = [];

/**
  * Color picker
*/
			  if (shoeVm.pickColor === '1'){
			      colorsArray = [shoeVm.firstColor];
			  } else if (shoeVm.pickColor === '2') {
			      colorsArray = [shoeVm.firstColor, shoeVm.secondColor];
			  } else {
	     		  colorsArray = [shoeVm.firstColor, shoeVm.secondColor, shoeVm.thirdColor];
			  }
/**
  * Conditions convert to keywords 
*/	
			if (shoeVm.cond.any){
				condArray = ['snow', 'rain', 'clear'];
			} else {
				if (shoeVm.cond.snow){ condArray.push('snow') }
				if (shoeVm.cond.rain){ condArray.push('rain') }
				if (shoeVm.cond.clear){ condArray.push('clear') }
			}

/**
  * Temperature convert to keywords 
*/

			if (shoeVm.temp.all){
				tempArray = ['hot', 'warm', 'cool', 'cold'];
			} else {
				if (shoeVm.temp.hot){ tempArray.push('hot') }
				if (shoeVm.temp.warm){ tempArray.push('warm') }
				if (shoeVm.temp.cool){ tempArray.push('cool') }
				if (shoeVm.temp.cold){ tempArray.push('cold') }
			}


			var updateShoe = {
				name: shoeVm.name,
				type: shoeVm.type,
				brand: shoeVm.brand,
				description: shoeVm.description,
				conditions: condArray,
				temperature: tempArray,
				colors: colorsArray,
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
	
				shoeVm.returnedShoe = res.data.shoe;
				shoeVm.name = shoeVm.returnedShoe[0].name;
				shoeVm.brand = shoeVm.returnedShoe[0].brand;
				shoeVm.description = shoeVm.returnedShoe[0].description;
				shoeVm.conditions = shoeVm.returnedShoe[0].conditions[0];
				shoeVm._id = shoeVm.returnedShoe[0]._id;
				
				var colorReturned = shoeVm.returnedShoe[0].colors;

/**
  * POPULATING COLOR THUMBS
*/

	// If less than 3 colors, shoe colors will return undefined (bug) 
	// Below fills in colors at all times
				if (!shoeVm.returnedShoe[0].colors[2]){
				  shoeVm.thirdColor = '##FFB6C1';
				} else {
				  shoeVm.secondColor = shoeVm.returnedShoe[0].colors[2];
				}
				if (!shoeVm.returnedShoe[0].colors[1]){
				  shoeVm.thirdColor = '#93013C';
				} else {
				  shoeVm.thirdColor = shoeVm.returnedShoe[0].colors[1];
				}
				shoeVm.firstColor = shoeVm.returnedShoe[0].colors[0];
				
  // checks how many colors there are
  // depending on how many, what input label will be set to, to show
				if (colorReturned.length === 3){
					shoeVm.pickColor = '3';
				} else if (colorReturned.length === 2) {
					shoeVm.pickColor = '2';
				} else {
					shoeVm.pickColor = '1';
				}

/**
  * Populating Shoe Type
*/
				for(var index in shoeVm.types){
					if(shoeVm.returnedShoe[0].type == shoeVm.types[index].value){
						shoeVm.type = shoeVm.types[index].value;
					}
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
					if (shoeVm.returnedShoe[0].temperature[i] === 'hot'){
						shoeVm.temp.hot = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] === 'warm'){
						shoeVm.temp.warm = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] === 'cold'){
						shoeVm.temp.cold = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] === 'cool'){
						shoeVm.temp.cool = true;
					}
					if (shoeVm.returnedShoe[0].temperature[i] === 'all'){
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
					if (shoeVm.returnedShoe[0].conditions[i] === 'snow'){
						shoeVm.cond.snow = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] === 'rain'){
						shoeVm.cond.rain = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] === 'clear'){
						shoeVm.cond.clear = true;
					}
					if (shoeVm.returnedShoe[0].conditions[i] === 'any'){
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





