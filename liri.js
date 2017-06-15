let keys = require('./keys.js');
let fs = require('fs');

let userCommand = process.argv[2];
let option = process.argv[3];

const commands = {
    'my-tweets': () => {
        let Twitter = require('twitter');
        let client = new Twitter({
          consumer_key: keys.twitter.consumer_key,
          consumer_secret: keys.twitter.consumer_secret,
          access_token_key: keys.twitter.access_token_key,
          access_token_secret:  keys.twitter.access_token_secret
        });

        client.get('/statuses/user_timeline.json', { count: 20 }, function(error, tweets, response) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            tweets.forEach( function(element) {
                let tweet = element.text;
                let d = new Date(element.created_at).toDateString();
                console.log(d, tweet)
            });
        });
    },
    'spotify-this-song': (option) => {
        let song = option || "Jungle Love";
        let Spotify = require('node-spotify-api');
        let client = new Spotify({
          id: keys.spotify.clientID,
          secret: keys.spotify.clientSecret
        });
         
        client.search({ type: 'track', query: song }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            let songData = data.tracks.items[0];
            console.log("Artist:",songData.artists[0].name)
            console.log("Song Title:",songData.name)
            console.log("Album:",songData.album.name)
            console.log("Link:",songData.preview_url)
        });
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