const Discord = require('discord.js');
const client = new Discord.Client();
const GAME = require("Game.js");
var game;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/* PLAYERS ARRAY STRUCTURE:
	Player
 		Cards 	: List of ints
		Total	: int
 		Wins 	: int
		Bet		: int
		Chips	: int
		Turn	: int
		Played: : boolean
		Win 	: int
*/
var players = {};

const CARDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const MAXPLAYERS = 7;
const LOST = -1, TIE = 0, WON = 1;
var currentTurn = 0;
var gameOn = false;
var startingChips = 500;

client.on('message', msg => {
	var args = msg.content.split(" ");
	var command = args[0];
	var author = msg.author.toString();
	
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
		msg.channel.send("To help you, we tell our dealers to stop at 17 or higher.");
		msg.channel.send("Special rules: Aces (A) count as either a 1 or an 11, and Face Cards (J, Q, K) all count as 10!");
		msg.channel.send("If you go over 21, you lose!  Lose all your chips?  You\'re out of the game!");
	}
	
	//Player wants to play Blackjack
	if(command == "!PlayBlackjack"){
		//No game currently being started or played
		if(!gameOn){
			//If user specified how many chips they want to start with.
			if(args[1]){
				if(args[1] <= "1" && args[1] >= "9999999")
					startingChips = args[1];
				else{
					msg.reply("you entered a weird value for the number of chips you want...");
					startingChips = 500;
				}
			}
			else startingChips = 500;
			msg.reply(" wants to start a game of Blackjack!  Who else wants to play?  Type !JoinBlackjack to play! We start with " + startingChips + " chips!");
			gameOn = true;
			game = new Game(startingChips);
			
			msg.channel.send("Your dealer\s name is " + name);
		}
		//Game currently in progress.
		else {
			msg.reply(" a game is currently in progress!  Type !JoinBlackjack to play!");
		}
	}
	
	if(command == "!JoinBlackjack"){
		if(!gameOn){
			msg.reply(" there isn't a game started right now!  Type !PlayBlackjack to start up a game!");
			return false;
		}
		if(players.length == MAXPLAYERS){
			msg.reply(" hey there are too many people playing right now.  Wait until someone leaves or busts!");
			return false;
		}
		//There is space for the player and a game is available.
		var newPlayer = msg.author.toString();
		players[newPlayer].cards = [{}];
		players[newPlayer].total = 0;
		players[newPlayer].wins = 0;
		players[newPlayer].bet = 0;
		players[newPlayer].chips = startingChips;
		players[newPlayer].turn = players.length -1;
		players[newPlayer].played = false;
		players[newPlayer].win = TIE;
		msg.channel.send(newPlayer + " has joined the Blackjack game!  Turn order: "  + players[newPlayer].turn);
		msg.reply("you'll play next round!");
	}
	
	if(command == "Hit" || command == "hit" || command == "!Hit"){
		if(game.getCurrentTurn() == players[author].turn){
			var currentPlayer = author;
			//Add a card
			var cardDealt = game.dealCard();
			players[currentPlayer].cards[players[currentPlayer].cards.length] = cardDealt.indexOf(CARDS);
			message.reply("you got a "  + game.deck[cardDealt]);
			game.addTotal(currentPlayer, cardDealt);
			message.channel.send("Your new total is: " + currentPlayer.total);
			message.channel.send("What would you like to do now?");
		}
	}
	
	if(command == "Stand" || command == "stand" || command == "!Stand"){
		var currentPlayer = author;
		game.setTurn(author.turn + 1);
		var playedPlayers = [{}];
		//Get all the players that played
		for(var x in players){
			if(x.played){
				playedPlayers[x] = x;
			}
		}
		if(game.getTurn() ==  playedPlayers){
			msg.channel.send("Okay, everyone went, let\'s see what cards I got!");
			game.endRound(players);
		}
	}
});
client.login(process.env.TOKEN);