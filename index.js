var express = require('express')
var alexa = require('alexa-app');
var bodyParser = require('body-parser');
var Twitter = require('twitter');


var server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set('view engine','ejs');

var port = process.env.PORT || 3978;
var app = new alexa.app('note');
var twitterClient;

app.launch(function(request, response) {
	connectTwitter(function() {
	    response.say('say what?');
		response.shouldEndSession(false);
	});
});

function connectTwitter(callback) {
	twitterClient = new Twitter({
	  consumer_key: process.env.TWITTER_CONSUMER_KEY,
	  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
	return callback();
}


app.intent("writeIntent",
	{
		"slots":[
			/*{
				"name": "text",
				"type": "AMAZON.LITERAL"
			}*/
		],
		"utterances": [
			"write"
		]
	},
	function(request,response) {
		twitterClient.post('statuses/update', {status: 'Hi! I\'m testing twitter with alexa'!},  function(error, tweet, response) {
		  	if(error) throw error;
		  	console.log(tweet);  // Tweet body. 
		  	console.log(response);  // Raw response object. 
			response.say("<s>Hi! Welcome to Jose's home. The Wi-Fi password is x and you have some fresh beer in the fridge</s>");
			response.shouldEndSession(false);		
		});
	}
);

app.intent("readIntent",
	{
		"slots":{},
		"utterances": [
			"read"
		]
	},
	function(request,response) {
		response.say("<s>Hi! Welcome home! I hope your day was well</s>");
		response.shouldEndSession(false);		
	}
);

app.intent("goodbyeIntent",
	{
		"slots":{},
		"utterances": [
			"goodbye"
		]
	},
	function(request,response) {
		response.say("<s>Goodbye</s>");
		response.shouldEndSession(true);		
	}
);

app.express(server, "/welcome/");

server.listen(port);
console.log("Listening on port "+port);