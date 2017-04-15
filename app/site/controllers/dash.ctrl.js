/**
  * user-dash.html
*/

(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('DashCtrl', DashCtrl);

	function DashCtrl(ShoeSrv, $scope, $state, $http, preloader){
		var user = this;

		user.editShoe = editShoe;
		user.deleteShoe = deleteShoe;
		user.modal= modal;
		user.level= "";

		//Loader
		user.loader = false;
		user.rainSvg = '../../assets/img/conditions_svg/raincondWhite.svg';
		user.snowSvg = '../../assets/img/conditions_svg/snowcondWhite.svg';
		user.clearSvg = '../../assets/img/conditions_svg/clearcondWhite.svg';

/**
=============== PRELOADING IMAGES ===============
	// Because pages load faster than the images
*/
		$scope.imageLocations = [
			'../../assets/img/conditions_svg/clearcond.svg',
			'../../assets/img/conditions_svg/raincond.svg',
			'../../assets/img/conditions_svg/snowcond.svg',
			'../../assets/img/conditions_svg/coldtemp.svg',
			'../../assets/img/conditions_svg/cooltemp.svg',
			'../../assets/img/conditions_svg/warmtemp.svg',
			'../../assets/img/conditions_svg/hottemp.svg',
			'../../assets/img/shoe_svg/boot.svg',
			'../../assets/img/shoe_svg/clog.svg',
			'../../assets/img/shoe_svg/dressShoe.svg',
			'../../assets/img/shoe_svg/flats.svg',
			'../../assets/img/shoe_svg/heels.svg',
			'../../assets/img/shoe_svg/other.svg',
			'../../assets/img/shoe_svg/sandles.svg',
			'../../assets/img/shoe_svg/sneaker.svg', 
      	];
      	// Preload the images; then, update display when returned.
     	preloader.preloadImages( $scope.imageLocations )
     	.then(function(res){
     		//Cond Images
			user.clearImg = res[0];
			user.rainImg = res[1];
			user.snowImg = res[2];

			// Temp Images
			user.coldImg = res[3];
			user.coolImg = res[4];
			user.warmImg = res[5];
			user.hotImg = res[6];
			
			// Shoe Images
			user.boots = res[7];
			user.clog = res[8];
			user.dressShoe = res[9];
			user.flats = res[10];
			user.heels = res[11];
			user.other = res[12];
			user.sandles = res[13];
			user.sneakers = res[14];
     	});

/**
=============== ADD SHOE BTN ===============
*/
		user.addShoeBtn = function(){
			console.log('going to shoe page');
			$state.go('user.add_shoe');
		};

/**
=============== RETRIEVE SHOE DATA ===============
*/
		ShoeSrv.getShoes()
			.then (function(res){
				console.log(res);
				user.allShoeData = res;
				return res;
		})
		.then(function(result){

			var numShoes = result.length;
			user.numShoes = result.length;

/**
  * Limiting Thumbnail Colors
*/			
			for (var i = 0; i < result.length; i++ ) {

				if (result[i].colors[0] === '#009DC1'){
					console.log(result[i].colors[0]);
					result[i].colors[0] = '#EDEDED';
				}
				if (result[i].colors[1] === '#93013C'){
					result[i].colors[1] = '#EDEDED';
				} 
				if (result[i].colors[2] === '#804615'){
					result[i].colors[2] = '#EDEDED';
				} 
			}

/**
  * Shoe level
*/
			if (user.numShoes > 75){
				user.level = 'Shoemniac';
			} else if (user.numShoes > 60){
				user.level = 'Shoe Guru';
			} else if (user.numShoes > 50){
				user.level = 'Shoephile';
			} else if (user.numShoes > 45){
				user.level = 'Shoe Hore';
			} else if (user.numShoes > 40){
				user.level = 'Shoe Hog';
			} else if (user.numShoes > 30){
				user.level = 'Shoedavor';
			} else if (user.numShoes > 25){
				user.level = 'Shoe Freak';
			} else if (user.numShoes > 20){
				user.level = 'Foot Fiend';
			} else if (user.numShoes > 15){
				user.level = 'Shoedius';
			} else if (user.numShoes > 10){
				user.level = 'Closet Stuffer';
			} else if (user.numShoes > 5){
				user.level = 'Two Foot Decorator';
			} else if (user.numShoes > 2){
				user.level = 'Casual Wearer';
			} else {
				user.level = 'Barefoot Peasant';
			}

			console.log(result.length);
			return result;
		});

/**
=============== EDIT SHOE ===============
  * Goes to edit page
*/

		function editShoe(shoe){
			$state.go('user.edit_shoe', {shoeId:shoe._id});
			console.log({shoeId:shoe._id});
		}

		$scope.$watch(function(){
	    	return ShoeSrv.shoes;
		}, function (newValue) {
			if(ShoeSrv.shoes.length > 0){
				console.log('You have shoes');
			    user.shoes = ShoeSrv.shoes;
			    user.is_shoes = true;
			}
		});

/**
=============== DELETE SHOE ===============
*/

	function deleteShoe(shoeId){
		console.log('deleted function is triggered');
		ShoeSrv.deleteShoe(shoeId);
	} //eo delete product



/**
=============== Modal Routing ===============
*/
	// manual hide & go to page instead of using angular & bootstrap built in attr
	// ani would freeze bc it was too fast to go to next page
	function modal(page){
		// manually hide model
		$('#myModal').modal('hide');
		// once hidden event is finished, then go to the page
		$('#myModal').on('hidden.bs.modal', function (e) {
		  console.log(page);
		  user.loader = true;
		  $state.go(page);

		})
	}
		


	}// eo userCtrl
})();