var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

//create a model using the Schema
var User = mongoose.model('User', userSchema);
module.exports = User;
