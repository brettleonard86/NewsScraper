

    
// // need to put this into a panel with the title as the panel name
// // add a save button
// //HANDLEBARS!!! {EACH}

//   //}
// });

// Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });


$(document).on("click", "#scrapeButt", function(){
  $.ajax({
    method: "POST",
    url: "/scrape"
  })
  .then(function(data){
    console.log(data)
    console.log("app scraped")
    $.GET("/articles", function(data){
      $("#articles").html(data);
      console.log("app.js scrape button pushed");
    });  
  });
  
});

// // Whenever someone clicks a p tag // need to change this to a save button 
// $(document).on("click", "#saveArt", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");


//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//   //With that done, add the note information to the page
//     .done(function(data){
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // AN input ot enter a new title
//       $("#notes").append("<input id='titleinput' name='title'>");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to subit a new note, with the id of the article save to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titelinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });



// WHen you click the savenote button
$(document).on("click", "#savenote", function(){
  // Grab the ID associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  //Run a post request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      //Value taken from title input
      title: $("#titleinput").val(),
      //Value take from note textarea
      body: $("#bodyinput").val(),
    }

    // With that done
    .done(function(data){
      //Log the response
      console.log(data);
      //Empty the notes section
      $("#notes").empty();
    })
  });  

  // Also, remove the values entered in the input fand textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");  
});