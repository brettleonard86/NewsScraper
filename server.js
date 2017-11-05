var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var morgan = require("morgan");

// add a button handler to the scrape button in the navbar

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newscraper", {
  useMongoClient: true
});

// Routes


app.get("/", function(req, res){
  res.render('index')
});

app.get("/saved", function(req, res){
  res.render('saved')
});

app.get("/scraped", function(req, res){
  res.render('scraped')
});

app.get("/articles", function(req, res){
  res.render('scraped')
});

// A GET route for scraping the KUSports website
app.post("/scrape", function(req, res){
  // First, we grab the body of the html with request
  axios.get("http://www2.kusports.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every li within an headlines tag, and do the following:
    $(".headlines li").each(function(i, element){

      // Add the text and href of every link, and save them as properties of the result object
      var result = {};

      //add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      
      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an article, send a message to the client
          res.send("Scrape Complete");
          res.render(result);
          
        })
        .catch(function(err){
          // if an error occured, send it to the client
          res.json(err);
        })
    });
  });
});

//Route for getting all Articles from the db
app.get("/articles", function(req, res){
  // Grab every docu in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle){
      // If we were able to successfully find Articles, send them back to the client
      res.render("scraped", {
        articles: dbArticle
      });
    })
    .catch(function(err){
      // If an error occurred, send it to the client
      res.render(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res){
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({_id: req.params.id})
    //.. and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle){
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err){
      // If an error occured, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res){
  // Create a new note and pass the req.body to the entry
  db.Note 
    .create(req.body)
    .then(function(dbNote){
      // If a note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update
      // the Article to be Associated with the new note
      // {new: true} tells the query that we want it to return the updated User -- it returns the original by default
      //Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
      // If we were able to successfully update an Article, send it back tot he client
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    });
});

app.listen(PORT, function(){
  console.log("App running on port " + PORT + "!");
});