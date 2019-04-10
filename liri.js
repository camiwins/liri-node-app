// =================================
// *** GLOBAL VARIABLES ***
// =================================

// * Disclaimer: I don't 100% understand this line, but the instructions say to put it in, lol.
require("dotenv").config();

// Variables that state the requirements to run this app
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

// =================================
// *** SPOTIFY ***
// =================================

// Create a variable that will import the spotify API's hidden in the keys.js
var spotify = new Spotify(keys.spotify);

// Create a function that will return an artists name which we pull in the next block of code
var getArtistNames = function (artist) {
  return artist.name;
}

// Spotify function that will...
var getSpotify = function (userSong) {
  // Searches for spotify for the type of track the user inputs
  spotify.search({ type: 'track', query: userSong }, function (err, data) {
    // * Disclaimer: This code was copied directly from the NPM documentation, after testing it, I realized it's not quite working.
    // This should also default to "The Sign" by Ace of Base, but I can't get it to work :(
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // Variable that points to the data we want to select from
    var songs = data.tracks.items;
    // For loop that goes through the returned data from songs variable and selects information that we want to display
    for (var i = 0; i < songs.length; i++) {
      console.log('==================')
      console.log(i);
      console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
      console.log('song name: ' + songs[i].name);
      console.log('preview song: ' + songs[i].preview_url);
      console.log('album: ' + songs[i].album.name);
      console.log('==================')
    }
  });
}

// =================================
// *** OMDB ***
// =================================
// * Disclaimer: Since I can't figure out how to make Errors work, I'm adding a note here that if this function has an error, it should default to "Mr. Nobody, which I haven't seen yet, but I will tonight lol.

// Variable that will store the function of the OMDB search
var getMovie = function (userMovie) {
  // Use axios to build the query URL and promise to retrieve selected data
  axios.get("https://www.omdbapi.com/?t=" + userMovie + "&y=&plot=short&apikey=trilogy").then(
    // Function to display the response and information in console
    function (response) {
      var movieData = (response.data);
      console.log('==================')
      console.log('Title: ' + movieData.Title);
      console.log('Year: ' + movieData.Year);
      console.log('IMDB Rating: ' + movieData.Ratings[0].Value);
      console.log('Rotten Tomatoes: ' + movieData.Ratings[1].Value);
      console.log('Country: ' + movieData.Country);
      console.log('Language: ' + movieData.Language);
      console.log('Plot: ' + movieData.Plot);
      console.log('Actors: ' + movieData.Actors);
      console.log('==================')
    })
};

// =================================
// *** BANDS IN TOWN ***
// =================================

// Variable to store the function of a user's search for concert
var getConcert = function (userConcert) {
  // Axios builds the URL with the user's input and promises to return the response
  axios.get("https://rest.bandsintown.com/artists/" + userConcert + "/events?app_id=codingbootcamp").then(
    // Function that returns the response with selected information and displays it
    function (response) {
      console.log('==================')
      console.log('Venue Name: ' + response.data[0].venue.name);
      console.log('Location: ' + response.data[0].venue.city + response.data[0].venue.region, response.data[0].venue.country);
      console.log(moment(response.data[0].datetime).format("DD/MM/YY hh:mm A"));
      console.log('==================')
      // Console log data for debugging
      // console.log(response.data[0])
    })
};

// =================================
// *** RANDOM TXT ***
// =================================
// * Disclaimer: This is bugged. If there's something in the random.txt file, it will always run this function :(

// Variable for the do what it says function
var doWhatItSays = function () {
  // Use the FS node package to pull up the random.txt file
  fs.readFile('random.txt', 'utf8', function (err, data) {
    console.log('==================')
    // * Disclaimer: This code was copied directly from the NPM documentation, after testing it, I realized it's not quite working.
    if (err) throw err;
    // // * Disclaimer: I had to watch supplemental video to get this portion of code as I struggled with it for so long. Can't claim any credit.
    var dataArr = data.split(',');
    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1])
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }
    console.log('==================')
  });
}

// =================================
// *** SWITCH FUNCTION ***
// =================================
// * Disclaimer: I referenced the video for this portion as well, I understand it better than the previous block of code, but was having trouble writing it without any help.

// Variable to switch commands and call the functions written above
var pick = function (caseData, functionData) {
  switch (caseData) {
    case 'spotify-this-song':
      getSpotify(functionData);
      break;
    case 'movie-this':
      getMovie(functionData);
    case 'do-what-it-says':
      doWhatItSays();
      break;
    case 'concert-this':
      getConcert(functionData);
      break;
    default:
      console.log("LIRI doesn't recognize this command. Try again.");
  }
}

// =================================
// *** APP ***
// =================================

// Function to run the application 
var runApp = function (a, b) {
  pick(a, b);
};
// Calls the above function and assigns the command line arguments
runApp(process.argv[2], process.argv[3]);

