(function(){
	'use strict';

	angular
		.module('weatherApp')
		.controller('IntroCtrl', IntroCtrl);

	function IntroCtrl($state){
		var intro = this;

		intro.bagshoeFront = '../../assets/img/shoe_svg/plasticbagshoes.svg';
		intro.heelsFront = '../../assets/img/shoe_svg/heelsFront.svg';
		intro.loaderGif = '../../assets/img/other/preloaderBoot.svg';
		intro.logo = '../../assets/img/other/solecastlogosans.svg';
		intro.rainSvg = '../../assets/img/conditions_svg/raincondWhite.svg';
		intro.snowSvg = '../../assets/img/conditions_svg/snowcondWhite.svg';
		intro.clearSvg = '../../assets/img/conditions_svg/clearcondWhite.svg';
		intro.loader = false;

		intro.main = function (){
			intro.loader = true;
			$state.go('user.front_page');
		}

  		var App = { numberOfDroplets: 30 };
		var i = 0;

		while( i < App.numberOfDroplets ){
		    var opacity = Math.random().toFixed(1); 
		    var y = 60 + ( opacity * 35 );
		    var duration = 1 + parseFloat(Math.random().toFixed(2));
		    var scale = opacity * 2;
		    var rainDroplet = {
		      left: parseInt( Math.random() * 100 ),
		      top: y,
		      opacity: opacity,
		      scale: scale,
		      duration: duration,
		      delay: duration / 4
		    };
		    executeRain(rainDroplet);
		  	i++;
		} // eo loop

	  	function executeRain(spawnDroplet){
	    	$('.rainAppend').append('<div class="droplet"><div class="flying"></div><div class="splashing"></div></div>');
		      var $droplet = $('.rainAppend .droplet').last();
		      var $flying = $droplet.find('.flying');
		      var $splashing = $droplet.find('.splashing');

		      $droplet.css({
	          	left: spawnDroplet.left + '%',
	        	top: spawnDroplet.top + '%',
	        	transform: 'scale(' + spawnDroplet.scale + ')',
	        	opacity: spawnDroplet.opacity
		      })
		      $flying.css({
	        	animation: spawnDroplet.duration + 's flying 4 linear',
	        	'animation-delay': spawnDroplet.delay + 's',
		      })
		      $splashing.css({
	        	animation: spawnDroplet.duration + 's splashing 4 linear',
		        'animation-delay': (spawnDroplet.duration+spawnDroplet.delay) + 's',
		      })
	  	}// eo execute rain
	}

})()