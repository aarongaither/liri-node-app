let keys = require('./keys.js');
let fs = require('fs');

let userCommand = process.argv[2];
let option = process.argv[3];

const commands = {
	'my-tweets': () => {
		console.log('tweets');
		let Twitter = require('twitter');
		let client = new Twitter({
		  consumer_key: keys.twitter.consumer_key,
		  consumer_secret: keys.twitter.consumer_secret,
		  access_token_key: keys.twitter.access_token_key,
		  access_token_secret:  keys.twitter.access_token_secret
		});

		client.get('/statuses/user_timeline.json', { count: 20 }, function(error, tweets, response) {
		  if(error) throw error;
		  tweets.forEach( function(element, index) {
		  	let tweet = element.text;
		  	let d = new Date(element.created_at).toDateString();
		  	console.log(d, tweet)
		  });
		});
	},
	'spotify-this-song': (option) => {
		let song = option || "The Sign";
		console.log(`Spotify: ${song}`);
	}, 
	'movie-this': (option) => {
		let movie = option || "Mr. Nobody";
		console.log(`Movie: ${movie}`);
	}, 
	'do-what-it-says': () => {
		let lines = fs.readFileSync('random.txt').toString().replace('\r','').split('\n');
		let [userCommand, option] = lines[Math.floor(Math.random() * lines.length)].split(',');
		commands[userCommand](option)
	}
};

!(userCommand in commands) ? console.log('Command not recognized. I am not THAT smart...') : commands[userCommand](option)