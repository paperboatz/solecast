var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var app = express();
var db = mongoose.connection;
mongoose.Promise = require('bluebird');
var jwt = require('express-jwt')

//ADD CORS HEADERS ONTO ALL THE ENDPOINTS TO ACCESS API 
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();
});

// Auth, Client Secret from Auth0.com
// decoded with base64
var authCheck = jwt({
	secret: new Buffer('VxSYfqXOks6bU-GZqv5tEk75Z2Pa1k1lfmbpRSnr6vsFg_NDLoKXfhdPOBXgj7f5', 'base64'),
	audience: 'Ogbt8GXgLCALmc2quBLz2hCQWPDEPRn5'
});

//APP CONFIG
app.use(bodyParser.json());
app.use(express.static(__dirname + './../app/'));

// DB CONNECTION
mongoose.connect('mongodb://localhost/data/db/');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('Connected to db at /data/db/')
});

// ROUTE CONFIG
var shoe_routes = require('./routes/shoe_routes');
var geo_routes = require('./routes/geo_routes'); 

// SET ROUTES
app.use('/api/shoes', shoe_routes);
app.use('/api/geo', geo_routes);

// LISTEN TO SERVER
app.listen(80, function() {
	console.log('gurrrrl listening to Port 80, stop with Ctrl + C');
});



