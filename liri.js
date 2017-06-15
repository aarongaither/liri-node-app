let keys = require('./keys.js')

let userCommand = process.argv[2];
let option = process.argv[3];

const commands = {
	'my-tweets': () => {console.log('tweets')},
	'spotify-this-song': (option) => {console.log(`Spotify: ${option}`)}, 
	'movie-this': (option) => {console.log(`Movie: ${option}`)}, 
	'do-what-it-says': () => {console.log('Do random thing.')}
};

!(userCommand in commands) ? console.log('Command not recognized. I am not THAT smart...') : commands[userCommand](option)