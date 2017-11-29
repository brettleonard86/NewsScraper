var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var morgan = require("morgan");
var exphbs = require("express-handlebars");



// Require all models
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Require our routes
var routes = require("./routes");

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Have every request go through our route middleware
app.use(routes);


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
let mongoUrl = process.env.MONGODB_URI || "mongodb://localhost/newscraper"
mongoose.connect(mongoUrl, {
  useMongoClient: true
});

app.listen(PORT, function(){
  console.log("App running on port " + PORT + "!");
});


