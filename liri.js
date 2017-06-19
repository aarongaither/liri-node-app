const inquirer = require('inquirer');

const args = (function () {
    let argsIn = process.argv.splice(2)

    let logging = argsIn.indexOf('--nolog') === -1 ? true : false;
    let printing = argsIn.indexOf('--noprint') === -1 ? true : false;
    let logArg = argsIn.indexOf('--logfile');
    let logFile = logArg === -1 ? 'log.txt' : argsIn[logArg + 1];

    return {
        logging,
        printing,
        logFile
    }
})()

const commands = (function(){
    const fs = require('fs');
    const keys = require('./keys.js');
    const logger = args.logging ? fs.createWriteStream(args.logFile, {flags: 'a'}) : 'no-log';

    let _logData = function (data) {
        if (args.logging) {
            logger.write(data+'\n');  
        }
        if (args.printing){
            console.log(data);
        }
    }

    let clearLog = function () {
        fs.writeFile(args.logFile, '', () => {
            if (args.printing) {
                console.log(`${args.logFile} cleared.`)
            }
        })
    };

    let tweetFetch = function () {
        const Twitter = require('twitter');
        let client = new Twitter({
            consumer_key: keys.twitter.consumer_key,
            consumer_secret: keys.twitter.consumer_secret,
            access_token_key: keys.twitter.access_token_key,
            access_token_secret:  keys.twitter.access_token_secret
        });

        client.get('/statuses/user_timeline.json', { count: 20 }, function(err, tweets, response) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            _logData('__My tweets__')
            tweets.forEach( function(element) {
                let tweet = element.text;
                let d = new Date(element.created_at).toDateString();
                _logData(`${d}: ${tweet}`)
            });
            _logData('\r')
        });
    };

    let songFetch = function (option) {
        let song = option || 'Jungle Love';
        const Spotify = require('node-spotify-api');
        let client = new Spotify({
          id: keys.spotify.clientID,
          secret: keys.spotify.clientSecret
        });
         
        client.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            let songData = data.tracks.items[0];
            _logData('__spotify-this-song__')
            _logData(`Artist: ${songData.artists[0].name}`)
            _logData(`Song Title: ${songData.name}`)
            _logData(`Album: ${songData.album.name}`)
            _logData(`Link: ${songData.preview_url}`)
            _logData('\r')
        });
    };

    let movieFetch = function (option) {
        const request = require('request');
        let movie = option || 'Mr. Nobody';
        let movieAtt = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors', 'Website'];
        request({
            method: 'GET',
            uri: `http://www.omdbapi.com/?apikey=${keys.OMDB}&t=${movie}`,
            json: true
        }, function (err, res, body){
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            _logData('__movie-this__')
            movieAtt.forEach( function(element, index) {
                _logData(`${element}: ${body[element]}`);
            });
            _logData('\r')
        });



    };

    let randomFetch = function () {
        fs.readFile('random.txt', 'utf8', function (err, data) {
            let lines = data.toString().replace('\r','').split('\n');
            let [command, option] = lines[Math.floor(Math.random() * lines.length)].split(',');
            _logData('__do-what-it-says__')
            commands[command](option)
        })
    };

    return {
        'clear-log': clearLog,
        'my-tweets': tweetFetch,
        'spotify-this-song': songFetch,
        'movie-this': movieFetch,
        'do-what-it-says': randomFetch
    }
})()

inquirer.prompt(
    {
      type: 'list',
      message: 'Hi, I am LIRI, what can I do for you?',
      choices: ['my-tweets','movie-this', 'spotify-this-song', 'do-what-it-says', 'clear-log'],
      name: 'command'
    }).then(function (res) {
        if (res.command === 'movie-this' || res.command === 'spotify-this-song'){
            let thing = res.command === 'movie-this' ? 'movie' : 'song';
            inquirer.prompt(
                {
                    type: 'input',
                    message: `Which ${thing} would you like info for?`,
                    name: 'option'
                }).then(function (res2) {
                    commands[res.command](res2.option)
                })
            } else {
                commands[res.command]()
            }
});
