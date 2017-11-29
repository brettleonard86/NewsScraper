// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


var scrape = function(){
  // First, we grab the body of the html with request
  return axios.get("http://www2.kusports.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles = []
    // Now, we grab every li within an headlines tag, and do the following:
    $(".headlines li").each(function(i, element){

      // Add the text and href of every link, and save them as properties of the result object
      var result = {};

      //add the text and href of every link, and save them as properties of the result object
      var head = $(this)
        .children("a")
        .text();

      var url = $(this)
        .children("a")
        .attr("href");
        url = "http://www.kusports.com" + url
      
    
      if (head && url) {
        // This section uses regular expressions and the trim function to tidy our headlines and summaries
        // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Initialize an object we will push to the articles array

        var dataToAdd = {
          headline: headNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
    
    return articles;

  });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;