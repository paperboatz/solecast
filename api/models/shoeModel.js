var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var shoeSchema = new Schema({
  name: String,
  type: String,
  brand: String,
  description: String,
  conditions: [String],
  temperature: [String],
  colors: [String],
  userid: String,
  created_at: Date,
  updated_at: Date
});


shoeSchema.pre('save', function(next) {
    // Get the current date.
    var currentDate = new Date();

    // Change the updated_at field to current date.
    this.updated_at = currentDate;

    // If created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }

    // Continue.
    next();
});

// Create a model using schema.
var Shoe = mongoose.model('Shoe', shoeSchema);

// Make available to our Node applications.
module.exports = Shoe;


