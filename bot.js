const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/* PLAYERS ARRAY STRUCTURE:
	Player
 		Cards 	: Array
 		Wins 	: int
		Bet		: int
		Chips	: int
		Turn	: int
*/
var players = {};

const MAXPLAYERS = 7;
var game = false;
var startingChips = 500;

client.on('message', msg => {
	var args = msg.content.split(" ");
	var command = args[0];
	
	//User wants to see command syntax
	if(command == "!helpBlackjack"){
		msg.reply(" type !PlayBlackjack to play a game of blackjack!   Type !Blackjack 1000 to start with 1000 chips (default 500)");
		msg.channel.send("Is there a game already in progress?  Type !JoinBlackjack if there are seats available!  Max  is 7!");
		msg.channel.send("Don\'t know how to play?  Type !HowToPlay to learn.");
	}
	
	//User wants to learn how to play
	if(command == "!HowToPlay"){
		msg.channel.send("Playing Blackjack is simple!  Take the total of your cards combined and compare it to the dealer\'s cards!");
		msg.channel.send("You can bet any amount of chips that you currently have BEFORE the cards are dealt.");
		msg.channel.send("Your goal is to beat the dealer's total without going over 21!");
		msg.channel.send("Special rules: Aces (A) count as either a 1 or an 11, and Face Cards (J, Q, K) all count as 10!");
		msg.channel.send("If you go over 21, you lose!  Lose all your chips?  You\'re out of the game!");
	}
	
	//Player wants to play Blackjack
	if(command == "!PlayBlackjack"){
		//No game currently being started or played
		if(!game){
			msg.reply(" wants to start a game of Blackjack!  Who else wants to play?  Type !JoinBlackjack to play!");
			game = true;
		}
		else {
			msg.reply(" a game is currently in progress!  Type !JoinBlackjack to play!");
		}
	}
});

function deal(){
	
}


client.login(process.env.TOKEN);