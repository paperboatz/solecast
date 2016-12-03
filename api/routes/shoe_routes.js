var ShoeSchema= require('./../models/shoeModel');
var express = require('express');
var router = express.Router();


//GET ALL SHOES FROM DATABASE
// this "/" end route is default endpoint
// in the browser it would be /api/shoes
router.get('/',function(req,res){

	console.log('Getting All Shoes from this userId: ' + req.query.user_id);
	
	var userId = req.query.user_id;

	// Pass user token from local storage from shoeSrv
	// to retrieve only those shoes with the userid
	// Sort reverse on updated 
	ShoeSchema.find({userid: userId}).sort({updated_at: -1}).then(function(shoe){
		res.json({ shoe:shoe
		});
	});
});

//GET A SHOE FROM USERBASE
router.get('/:shoeId',function(req,res){
	console.log('Getting shoe with ID: '+ req.params.shoeId);
	// grabs the routeparams from browser
	// then finds that _id in the database that matches
	// returns response, the whole object with that unique id
	var where = {_id:req.params.shoeId};
	ShoeSchema.find(where).then(function(shoe){
		console.log(shoe)
		res.json({ shoe:shoe
		});
	});
});

//UPDATE SHOE FROM DATABASE
router.put('/:shoeId',function(req,res){

	// must pass through a the req to update
	// the object is req.body
	// the query finds the specific item with the id
	// sends the object it needs to be updated with
	var update = req.body;
	console.log(req.params);
	console.log(req.body)
	var query = {_id:req.params.shoeId};
	ShoeSchema.update(query,update,{},function(err,shoe){
        if(err){
        	res.send('err');
            console.log(err);
        }
        else{
        	res.send("shoe updated");
            console.log(shoe);
        }
    });
});


//ADD NEW SHOE TO DATABASE
router.post('/newshoe',function(req,res){

	var newShoe = ShoeSchema({
		name: req.body.name,
		type: req.body.type,
		brand: req.body.brand,
		description: req.body.description,
		conditions: req.body.conditions,
  		temperature: req.body.temperature,
  		colors: req.body.colors,
  		userid: req.body.userid
		})

	console.log(newShoe);

	// save the data 
	newShoe.save(function(err) {
	    if (err) {
	        console.log(err)
	    } else {
	        console.log('Shoe created');
	        res.send(req.body)
	    }
	});

});

//DELETE SHOE FROM DATABASE
router.delete('/:shoeId',function(req,res){
	
	console.log('delete shoeId')
	console.log(req)
	var where = {_id:req.params.shoeId};

	console.log(req.params.shoeId)

	console.log(where);

	ShoeSchema.findOne(where, function(err, shoe) {
	    if (err) {
	        console.log(err);
	        res.send(err);
	    } else {
	        shoe.remove(function(err) {
	            if (err) {
	                console.log(err);
	                res.send('error')
	            } else {
	                res.send('shoe deleted')
	                console.log('shoe deleted: ' + shoe);
	            }
	        });
	    }
	});
});

module.exports = router;

