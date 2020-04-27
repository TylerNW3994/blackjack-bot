const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var players = {};
//var player = {"cards": [], "total": 0, "wins": 0, "bet": 0, "chips": 0, "turn": 0, "played": false, "win": 0};
var dealer = {"cards": [], "total": 0, "name": ""};
var newDeck = ["1", "1", "1", "1",
			"2", "2", "2", "2",
			"3", "3", "3", "3",
			"4", "4", "4", "4",
			"5", "5", "5", "5",
			"6", "6", "6", "6",
			"7", "7", "7", "7",
			"8", "8", "8", "8",
			"9", "9", "9", "9",
			"10", "10", "10", "10",
			"J", "J", "J", "J",
			"Q", "Q", "Q", "Q",
			"K", "K", "K", "K",
			"A", "A", "A", "A"];
var deck = newDeck;

const CARDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const MAXPLAYERS = 7;
const LOST = -1, TIE = 0, WON = 1;
var currentTurn = 0;
var gameOn = false;
var startingChips = 500;
var ready = false;

function player(name, cards, total, wins, bet, chips, turn, played, win, ready){
	this.name = name;
	this.cards = cards;
	this.total = total;
	this.wins = wins;
	this.bet = bet;
	this.chips = chips;
	this.turn = turn;
	this.played = played;
	this.win = win;
	this.ready = ready;
}

client.on('message', msg => {
	var args = msg.content.split(" ");
	var command = args[0];
	var author = msg.author.toString();
	
	//User wants to see command syntax
	if(command == "!helpBlackjack" || command == "helpBlackjack" || command == "helpblackjack"){
		msg.reply(" type !PlayBlackjack to play a game of blackjack!   Type !Blackjack 1000 to start with 1000 chips (default 500)");
		msg.channel.send("Is there a game already in progress?  Type !JoinBlackjack if there are seats available!  Max  is 7!");
		msg.channel.send("When you want to leave the game, type !Leave")
		msg.channel.send("Don\'t know how to play?  Type !HowToPlay to learn.");
	}
	
	//User wants to learn how to play
	if(command == "!HowToPlay" || command == "!howtoplay" || command == "howtoplay" || command == "HowToPlay"){
		msg.channel.send("Playing Blackjack is simple!  Take the total of your cards combined and compare it to the dealer\'s cards!");
		msg.channel.send("You can bet any amount of chips that you currently have BEFORE the cards are dealt.");
		msg.channel.send("Your goal is to beat the dealer's total without going over 21!");
		msg.channel.send("To help you, we tell our dealers to stop at 17 or higher.");
		msg.channel.send("Special rules: Aces (A) count as either a 1 or an 11, and Face Cards (J, Q, K) all count as 10!");
		msg.channel.send("If you go over 21, you lose!  Lose all your chips?  You\'re out of the game!");
	}
	
	//Player wants to play Blackjack
	if(command == "!PlayBlackjack" || command == "pbj" || command == "PBJ" || command == "playblackjack"){
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
			var nameChance = Math.floor((Math.random() * 10) + 1);
			var name = "";
			switch(nameChance){
				case 1: name = "Mike"; break;
				case 2: name = "Shaniqua"; break;
				case 3: name = "Franklin"; break;
				case 4: name = "Mila"; break;
				case 5: name = "Chad"; break;
				case 6: name = "Hannah"; break;
				case 7: name = "Chris"; break;
				case 8: name = "Lee"; break;
				case 9: name = "Mikayla"; break;
				case 10: name = "Ben";
			}
			this.currentTurn = 0;
			dealer.name = name;
			
			msg.channel.send("Your dealer\'s name is " + dealer.name);
			msg.channel.send(dealer.name + ": When everyone is ready, type !Ready");
		}
		//Game currently in progress.
		else {
			msg.reply(" a game is currently in progress!  Type !JoinBlackjack to play!");
		}
	}
	
	if(command == "!JoinBlackjack" || command == "jbj" || command == "JBJ" || command == "!joinblackjack"){
		if(!gameOn){
			msg.reply(" there isn't a game started right now!  Type !PlayBlackjack to start up a game!");
			return false;
		}
		if(players.length == MAXPLAYERS){
			msg.reply(" hey there are too many people playing right now.  Wait until someone leaves or busts!");
			return false;
		}
		//There is space for the player and a game is available.
		var newPlayer = new player(msg.author.username, [], 0, 0, 0, startingChips, Object.keys(players).length, false, TIE, ready);
		players[author] = newPlayer;
		
		msg.channel.send(newPlayer.name + " has joined the Blackjack game!  Turn order: "  + newPlayer.turn);
		
	}
	
	if(command == "Scores" || command == "scores" || command == "score" || command == "SCORE"){
		if(gameOn){
			var playerScores = "";
			for(var x in players){
				playerScores += players[x].name + " has " + players[x].chips + " chips. \n";
			}
			msg.channel.send(playerScores);
		}
	}
	
	if(command == "myscore" || command == "MyScore" || command == "!myscore" ){
		if(gameOn){
			msg.reply("you currently have " + players[author].chips);
		}
	}
	
	if(command == "Hit" || command == "hit" || command == "!Hit"){
		if(this.getCurrentTurn() == players[author].turn){
			var currentPlayer = author;
			//Add a card
			var cardDealt = this.dealCard();
			players[currentPlayer].cards[players[currentPlayer].cards.length] = cardDealt.indexOf(CARDS);
			msg.reply("you got a "  + this.deck[cardDealt]);
			this.addTotal(currentPlayer, cardDealt);
			msg.channel.send("Your new total is: " + currentPlayer.total);
			msg.channel.send("What would you like to do now?");
		}
	}
	
	if(command == "Stand" || command == "stand" || command == "!Stand"){
		if(this.getCurrentTurn() == players[author].turn){
			var currentPlayer = author;
			this.setTurn(author.turn + 1);
			var playedPlayers = [{}];
			//Get all the players that played
			for(var x in players){
				if(x.played){
					playedPlayers[x] = x;
				}
			}
			if(this.getTurn() ==  playedPlayers.length){
				msg.channel.send("Okay, everyone went, let\'s see what cards I got!");
				game.endRound(players, msg);
			}
		}
	}
	
	if(command == "!ready" || command == "!Ready"){
		if(gameOn){
			players[author].ready = true;
			for(var x in players){
				if(!players[x].ready)
					return false;
			}
			newRound(players, msg);
			
		}
	}
	
	if(command == "Leave" || command == "leave" || command == "!Leave"){
		if(players[author]){
			//decrease the turn order of all the players after the leaving player
			for(var i = author.indexOf(players); i < players.length; i++){
				players[i].turn--;
			}
			msg.reply(" see you later!");
			delete players[author];
		} else {
			msg.reply("you\'re not in the game!");
		}
	}
	
	if(command == "Bet" || command == "bet" || command == "!Bet"){
		if(args[1]){
			var chipsBet = args[1];
			if(chipsBet <= 0 || chipsBet > players[author].chips){
				msg.reply("that's an invalid amount of chips!");
				return false;
			}
			
		}
		else msg.reply("type !Bet followed by the number of chips you want to bet!");
	}
});

function newRound(players, msg){
	msg.channel.send("Alright, time for another round!");
	msg.channel.send(dealer.name + " is shuffling the cards...");
	deck = newDeck;
	shuffleDeck(deck);
	msg.channel.send(dealer.name + ":");
	//Remove all the cards from the players
	for(var x in players){
		players[x].cards = [];
		players[x].bet = 0;
		msg.channel.send("@" + players[x].name + ", what do you want to bet?  You currently have " + players[x].chips + " chips.");
	}
	
}

function dealCard(){
	var pulledCard = deck.pop();
	return pulledCard;
}

function shuffleDeck(deck){
	// for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

function endRound(players, msg){
	while(getDealerTotal() < 17){
		var cardDealt = this.dealCard();
		dealer.cards[dealer.cards.length] = addTotal(dealer, cardDealt);
		msg.channel.send("I got a "  + game.deck[cardDealt]);
		msg.channel.send("My new total is: " + dealer.total);
	}
	
	//Dealer bust
	if(getDealerTotal() > 21){
		message.channel.send("I bust!  You all win!");
		for(var x in players){
			x.win = true;
		}
	}
	
	//Dealer didn't bust but stayed past or at 17
	else{
		for(var x in players){
			//Player won
			if(x.total > getDealerTotal()){
				x.chips += x.bet;
				msg.channel.send(x + " won!  New chips amount: " + x.chips);
			}
			//Player tied
			else if(x.total == getDealerTotal()){
				msg.channel.send(x + " and I tied.  No change in chips!");
			}
			//Player lost
			else if(x.total < getDealerTotal()){
				x.chips -= x.bet;
				msg.channel.send(x + " lost!  New chips amount: " + x.chips);
			}
			//ERROR
			else {
				msg.channel.send("Tyler, there\'s a mistake determining who won.");
			}
		}
	}
}

//If a card is a face card, turn it into a 10.  Ace, turn into either  1 or 11.
function addTotal(player, card){
	if(card.indexOf(CARDS) > 9){
		//Ace
		if(card.indexOf(CARDS) == 13){
			//Ace should be a 1
			if(player.total >= 11)
				player.total++;
			//Ace should be an 11
			else player.total += 11;
		}
		else player.total += 10;
	}
	else player.total += card.indexOf(CARDS) + 1;
}

function getDealerTotal(){
	return dealer.total;
}

function getChips() {
	return this.startingChips;
}

function getTurn() {
	return this.currentTurn;
}

function setTurn(turn) {
	this.currentTurn++;
}
import { key } from "./config.js";
client.login(key);