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

			console.log(user.allShoeData);

			user.numShoes = result.length;
			var numShoes = user.numShoes; 

			// Creating Shoe Levels based on how many shoes we have
			// the level coincide with levelName's index
			// by using Math.Floor, we can create ranges. 
			var levelNames = [
				'Barefoot Peasant', 'Casual Wearer', 'Two Foot Decorator', 'Closet Stuffer', 'Shoedius',
				'Foot Fiend', 'Shoe Freak', 'Shoedavor', 'Shoe Hog', 'Shoe Hore', 
				'Shoephile', 'Shoe Guru', 'Shoeniac', 'Shoemasty', 'The Grandmaster Shoester'
			]

			function shoelvl(numShoes){
				var level = Math.floor(numShoes / 4);
				console.log(level);
				if (numShoes > 60) {level = levelNames.length}
				return user.level = levelNames[level];
			}

			shoelvl(numShoes);

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