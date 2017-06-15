let keys = require('./keys.js');
let fs = require('fs');

let userCommand = process.argv[2];
let option = process.argv[3];

const commands = {
	'my-tweets': () => {console.log('tweets')},
	'spotify-this-song': (option) => {console.log(`Spotify: ${option}`)}, 
	'movie-this': (option) => {console.log(`Movie: ${option}`)}, 
	'do-what-it-says': () => {
		let file = fs.readFileSync('random.txt');
		let lines = file.toString().replace('\r','').split('\n');
		let useLine = lines[Math.floor(Math.random() * lines.length)].split(',');
		commands[useLine[0]](useLine[1])
	}
};

!(userCommand in commands) ? console.log('Command not recognized. I am not THAT smart...') : commands[userCommand](option)