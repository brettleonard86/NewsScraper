var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, creat a new UserSChema object 
// This is simialar to a Sequelize model
var headlineSchema = new Schema({
  //`title` is required and of type
  headline: {
    type: String,
    required: true,
    unique: { index: {unique: true }}
  },
  // `link` is required and of type String
  url: {
    type: String,
    required: true
  },
  //date
  date: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  }

});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", headlineSchema);

//Export the Headline model
module.exports = Headline;
