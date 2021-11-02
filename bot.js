// Required elements of the assignment

// 1. The node.js source files, zipped and uploaded.  Be sure to include comments in your code, explaining what it is doing.
// 2.  A one-page prose project statement, including a screenshot of your twitter page with some produced tweets, attached as a pdf.  What did you do and why? What was the purpose of your bot?

// As indicated above, the basic bot must:
//     take information from the Twitter feed
//     modify or manipulate that information
//     respond into the Twitterverse (e.g. post, retweet etc.)

// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#cat' hashtag.
var catSearch = {q: "#cat", count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the #cat hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', catSearch, function (error, data) {
	  // log out any errors and responses
	//   console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// grab  ID of the tweet we want to respond to
		var tweetId = data.statuses[0].id_str;
		// add Meow to tweet text
		var replyText = data.statuses[0].text;
		var splitText = replyText.split(" ");
		console.log(splitText);
		var newString = splitText[0] + " " + splitText[1];
		for (let i = 2; i <= splitText.length; i += 2) {
			newString += splitText[i] + " meow! ";
			console.log(newString);
		}
		
		// tell Twitter we want to respond to the tweet
		T.post('statuses/update', { status: newString, in_reply_to_status_id: tweetId }, function (error, response) {;
		// T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Our bot replied something!')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
