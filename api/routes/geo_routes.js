
var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/',function(req,res){

	var longitude = req.query.longitude;
	var latitude = req.query.latitude; 
	var apiUrl = 'https://api.darksky.net/forecast/71cbfb7d0ce59960a22a3b04b2959d46/'+latitude+','+longitude+'?exclude=minutley,flags,alerts&units=si';

	request(apiUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log('Sucess');
	    console.log(body);
	    res.send(body); // must send response 
	  } else {
	  	res.send('there is error');
	  	console.log('there is error');
	  }
	});

});


router.get('/zipcode', function(req,res){

	var zip = req.query.zip;
	var urlzip = 'http://maps.googleapis.com/maps/api/geocode/json?address='+ zip;
	
	request(urlzip, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log('sucess geo')
			console.log(body);
			res.send(body);
		} else {
			res.send('there is error zip api')
			console.log('there is a error zip api')
		}
	});

});

router.get('/geolocation',function(req,res){


	// If there is an Error (they refuse to give lat long) 
	// latitude returns undefined, NaN
	// then lat, long will be this:
	var longitude = req.query.longitude;
	var latitude = req.query.latitude;
	var urlKey ='AIzaSyAP3qeMV645J-aqOLdiTWa796umXkPVedw';
	var urlGeo = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+urlKey;

	request(urlGeo, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log('Sucess /geolocation')
	    console.log(body);
	    res.send(body); // must send response 
	  } else {
	  	res.send('there is error Geo Api');
	  	console.log('there is error Geo Api');
	  }
	});
});

module.exports = router;


// NOTES
// Install node request to make http calls in node
// we will see every resp from server in server terminal!! not in developer tools
// See headers not in console.log object, BUT...
// network tab in dev tools chrome, click on link to see header

// Everytime we hit the /test url, it will grab the
// req.query sent in by GET request from clientside
// we will use that in the request, with variables in our query 

// OTHER NOTES
// middleware executes from top bottom


