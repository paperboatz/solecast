
/* In CoffeeShop.js */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  country: String,
  city: String,
  created_at: Date,
  updated_at: Date
});



userSchema.pre('save', function(next) {
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
var User = mongoose.model('User', userSchema);

// Make available to our Node applications.
module.exports = User;