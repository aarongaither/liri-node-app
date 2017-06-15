let keys = require('./keys.js');
let fs = require('fs');

let userCommand = process.argv[2];
let option = process.argv[3];

let logger = fs.createWriteStream('log.txt', {flags: 'a'});

function logData (data) {
    logger.write(data+'\n');
    console.log(data)
}

const commands = {
    'my-tweets': () => {
        let Twitter = require('twitter');
        let client = new Twitter({
          consumer_key: keys.twitter.consumer_key,
          consumer_secret: keys.twitter.consumer_secret,
          access_token_key: keys.twitter.access_token_key,
          access_token_secret:  keys.twitter.access_token_secret
        });

        client.get('/statuses/user_timeline.json', { count: 20 }, function(err, tweets, response) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            logData('__My tweets__')
            tweets.forEach( function(element) {
                let tweet = element.text;
                let d = new Date(element.created_at).toDateString();
                logData(`${d}: ${tweet}`)
            });
            logData('\r')
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
            logData('__spotify-this-song__')
            logData(`Artist: ${songData.artists[0].name}`)
            logData(`Song Title: ${songData.name}`)
            logData(`Album: ${songData.album.name}`)
            logData(`Link: ${songData.preview_url}`)
            logData('\r')
        });
    }, 
    'movie-this': (option) => {
        let movie = option || "Mr. Nobody";
        const request = require('request');
 
        let movieAtt = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors', 'Website'];

        request({
            method: 'GET',
            uri: `http://www.omdbapi.com/?apikey=${keys.OMDB}&t=${movie}`,
            json: true
        }, function (err, res, body){
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            logData('__movie-this__')
            movieAtt.forEach( function(element, index) {
                logData(`${element}: ${body[element]}`);
            });
            logData('\r')
        })
    }, 
    'do-what-it-says': () => {
        let lines = fs.readFileSync('random.txt').toString().replace('\r','').split('\n');
        let [userCommand, option] = lines[Math.floor(Math.random() * lines.length)].split(',');
        logData('__do-what-it-says__')
        commands[userCommand](option)
    }
};

!(userCommand in commands) ? console.log('Command not recognized. I am not THAT smart...') : commands[userCommand](option)