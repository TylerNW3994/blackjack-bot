const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var players = {};
var playerTurns = {};
var keyVar;
//const config = require("./config.json");
//var player = {"cards": [], "total": 0, "wins": 0, "bet": 0, "chips": 0, "turn": 0, "played": false, "win": 0};
var dealer = {"cards": [], "total": 0, "name": ""};
var newDeck = ["2", "2", "2", "2",
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
		if(Object.keys(players).length == MAXPLAYERS){
			msg.reply(" hey there are too many people playing right now.  Wait until someone leaves or busts!");
			return false;
		}
		//There is space for the player and a game is available.
		var newPlayer = new player(msg.author.username, [], 0, 0, 0, startingChips, Object.keys(players).length, true, TIE, ready);
		players[author] = newPlayer;
		
		msg.channel.send(newPlayer.name + " has joined the Blackjack game!  Turn order: "  + newPlayer.turn);
		
	}
	if(players[author] && !gameOn){
		if(command == "Scores" || command == "scores" || command == "score" || command == "SCORE"){
			var playerScores = "";
			for(var x in players){
				playerScores += players[x].name + " has " + players[x].chips + " chips. \n";
			}
			msg.channel.send(playerScores);
		}
		
		if(command == "myscore" || command == "MyScore" || command == "!myscore" ){
			if(gameOn){
				msg.reply("you currently have " + players[author].chips);
			}
		}
		
		if(command == "Hit" || command == "hit" || command == "!Hit"){
			if(currentTurn == players[author].turn){
				var currentPlayer = author;
				//Add a card
				var cardDealt = dealCard();
				players[currentPlayer].cards[players[currentPlayer].cards.length] = CARDS.indexOf(cardDealt);
				msg.reply("you got a "  + cardDealt);
				addTotal(players[currentPlayer], cardDealt);
				if(players[currentPlayer].total > 21){
					nextTurn(msg);
					msg.reply(" you bust!");
					players[currentPlayer].won = LOST;
					players[currentPlayer].played = true;
					//Make sure all players played.
					for(var x in players){
						if(!players[x].played){
							return false;
						}
					}
					msg.channel.send("Okay, everyone went, let\'s see what cards I got!");
					endRound(players, msg);
					return false;
				}
				msg.channel.send("Your new total is: " + players[currentPlayer].total);
				msg.channel.send("What would you like to do now?");
			}
			else msg.reply(" it isn't your turn right now!");
		}
		
		if(command == "Stand" || command == "stand" || command == "!Stand"){
			if(currentTurn == players[author].turn){
				nextTurn(msg);
				players[author].played = true;
				//Make sure all players played.
				for(var x in players){
					if(!players[x].played){
						return false;
					}
				}
				msg.channel.send("Okay, everyone went, let\'s see what cards I got!");
				endRound(players, msg);
			}
			else msg.reply(" it isn't your turn right now!");
		}
		
		if(command == "!ready" || command == "!Ready"){
			if(gameOn){
				players[author].ready = true;
				//Check if all players are ready
				for(var x in players){
					if(!players[x].ready)
						return false;
				}
				//All players are ready
				newRound(players, msg);
				
			}
		}
		
		if(command == "Leave" || command == "leave" || command == "!Leave"){
			if(players[author]){
				//decrease the turn order of all the players after the leaving player
				for(var x in players){
					if(players[x].turn > players[author].turn)
						players[x].turn--;
				}
				msg.reply(" see you later!");
				delete players[author];
				if(Object.keys(players).length == 0){
					msg.channel.send("Well, no one wants to play Blackjack so " + dealer.name + " is going to go home!  Type !PlayBlackjack if you want to play again!");
					gameOn = false;
				}
			} else {
				msg.reply("you\'re not in the game!");
			}
		}
		
		if(command == "Bet" || command == "bet" || command == "!Bet"){
			//If not a player, ask them if they want to join!
			if(!players[author]) msg.reply(" do you want to play? Type !JoinBlackjack to play!");
			
			//If joining a game in progress or has already played, tell the user to wait until next game
			if(players[author].played) msg.reply(" wait until next game!");
			
			if(args[1]){
				var chipsBet = args[1];
				//Invalid amount of chips
				if(chipsBet <= 0 || chipsBet > players[author].chips){
					msg.reply("that's an invalid amount of chips!");
					return false;
				}
				players[author].bet = chipsBet;
				//Check if all players have bet
				for(var x in players){
					if(players[x].bet == 0)
						return false;
				}
				//All players are ready
				msg.channel.send("All bets have been put in!  " + dealer.name + " is dealing cards!");
				for(var x in players) {
					players[x].cards = [dealCard(), dealCard()]
					addTotal(players[x], players[x].cards[0]);
					addTotal(players[x], players[x].cards[1]);
				}
				dealer.cards = [dealCard(), dealCard()];
				addTotal(dealer, dealer.cards[0]);
				addTotal(dealer, dealer.cards[1]);
				msg.channel.send(dealer.name + " has a " + dealer.cards[0] + " and another card!");
				for(var x in players){
					msg.channel.send(players[x].name + ", it\'s your turn!");
					msg.channel.send(players[x].name + ", your cards are :\n");
					drawCards(msg, players[x].cards);
					msg.channel.send(players[x].name + ", your current count is " + players[x].total);
					return false;
				}
			}
			else msg.reply("type !Bet followed by the number of chips you want to bet!");
		}
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
		players[x].played = false;
		msg.channel.send(players[x].name + ", what do you want to bet?  You currently have " + players[x].chips + " chips.");
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
	msg.channel.send("My cards :");
	drawCards(msg, dealer.cards);
	msg.channel.send("Currently, I have a " + dealer.total);
	var max = 0;
	for(var x in players){
		if(players[x].total < 21 && players[x].total > max)
			max = players[x].total;
	}
	
	while(dealer.total < 17 || dealer.total < max){
		msg.channel.send("I\'m going to hit!");
		var cardDealt = dealCard();
		dealer.cards[dealer.cards.length] = cardDealt;
		addTotal(dealer, cardDealt);
		msg.channel.send("I got a "  + cardDealt);
		msg.channel.send("My new total is: " + dealer.total);
	}
	
	//Dealer bust
	if(dealer.total > 21){
		msg.channel.send("I bust!  Those that didn\'t bust win!");
		for(var x in players){
			players[x].ready = false;
			if(players[x].total <= 21){
				players[x].win = true;
				players[x].chips += parseInt(players[x].bet);
				msg.channel.send(players[x].name + " won!  New chips amount: " + players[x].chips);
			}
			//Player previously bust
			else {
				players[x].chips -= parseInt(players[x].bet);
				msg.channel.send(players[x].name + " lost!  New chips amount: " + players[x].chips);
				if(players[x].chips == 0){
					msg.channel.send("Hey Everyone, " + players[x].name + " lost ALL their chips.  Can we get an F in the chat?");
					msg.channel.send("F");
					msg.channel.send("Don\'t worry " + players[x].name + ", I\'ll give you some chips back so you can keep playing!\n\n");
					players[x].chips = startingChips;
				}
			}
			players[x].total = 0;
			dealer.total = 0;
		}
	}
	
	//Dealer didn't bust but stayed past or at 17
	else{
		msg.channel.send("Alright, I'm staying with a " + dealer.total);
		for(var x in players){
			players[x].ready = false;
			if(players[x].won != LOST){
				//Player won
				if(players[x].total > dealer.total){
					players[x].chips += parseInt(players[x].bet);
					msg.channel.send(players[x].name + " won!  New chips amount: " + players[x].chips);
				}
				//Player tied
				else if(players[x].total == dealer.total){
					msg.channel.send(players[x].name + " and I tied.  No change in chips!");
				}
				//Player lost
				else if(players[x].total < dealer.total){
					players[x].chips -= parseInt(players[x].bet);
					msg.channel.send(players[x].name + " lost!  New chips amount: " + players[x].chips);
					if(players[x].chips == 0){
						msg.channel.send("Hey Everyone, " + players[x].name + " lost ALL their chips.  Can we get an F in the chat? \nF");
						msg.channel.send("Don\'t worry " + players[x].name + ", I\'ll give you some chips back so you can keep playing!");
						players[x].chips = startingChips;
					}
				}
				//ERROR
				else {
					msg.channel.send("Tyler, there\'s a mistake determining who won.");
				}
			}
			players[x].total = 0;
		}
	}
	dealer.total = 0;
	currentTurn = 0;
	msg.channel.send("Okay everyone, when you want to play again, type !Ready");
}

//If a card is a face card, turn it into a 10.  Ace, turn into either  1 or 11.
function addTotal(player, card){
	if(CARDS.indexOf(card) > 9){
		//Ace
		if(CARDS.indexOf(card) == 13){
			//Ace should be a 1
			if(player.total >= 11)
				player.total++;
			//Ace should be an 11
			else player.total += 11;
		}
		//Face card
		else player.total += 10;
	}
	else player.total += CARDS.indexOf(card) + 1;
}

function getDealerTotal(){
	return dealer.total;
}

function getChips() {
	return this.startingChips;
}

function nextTurn(msg) {
	currentTurn++;
	for(var x in players){
		if(players[x].turn == currentTurn){
			msg.channel.send(players[x].name + " it\'s your turn!");
			msg.channel.send(players[x].name + ", your cards are " + players[x].cards[0] + " and " +  players[x].cards[1] + "\n");
			drawCards(msg, players[x].cards);
			msg.channel.send(players[x].name + ", your current count is " + players[x].total);
		}
		if(players[x].turn == currentTurn + 1){
			msg.channel.send(playerTurns[x] + ", you\'re on deck!");
			return false;
		}
	}
}

function drawCards(msg, cardVals){
	var reps = cardVals.length;
	for(var i = 0; i < reps; i++){
		msg.channel.send("-------------");
		msg.channel.send("|\t \t \t\t|");
		if(cardVals[i] != 10)
			msg.channel.send("|  \t  " + cardVals[i] +"  \t  |");
		//Remove one space for 10 for visual purpose.
		else msg.channel.send("|  \t  " + cardVals[i] +" \t  |");
		msg.channel.send("|\t \t \t\t|");
		msg.channel.send("-------------");
	}
}

function getTurn() {
	return this.currentTurn;
}

client.login(process.env.TOKEN);