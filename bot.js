const Discord = require('discord.js');
const client = new Discord.Client();

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
var dealer = {};
var newDeck = ["A", "A", "A", "A",
			"1", "1", "1", "1",
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
			"K", "K", "K", "K"];
var deck = newDeck;

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
			//game = new Game(startingChips);
			
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
		if(this..getCurrentTurn() == players[author].turn){
			var currentPlayer = author;
			//Add a card
			var cardDealt = game.dealCard();
			players[currentPlayer].cards[players[currentPlayer].cards.length] = cardDealt.indexOf(CARDS);
			msg.reply("you got a "  + game.deck[cardDealt]);
			game.addTotal(currentPlayer, cardDealt);
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
	
	if(command == "Leave" || command == "leave" || command == "!Leave"){
		if(players[author]){
			//decrease the turn order of all the players after the leaving player
			for(var i = author.indexOf(players); i < players.length; i++){
				players[i].turn--;
			}
			msg.reply(" see you later!");
			delete players[author];
		} else {
			msg
		}
	}
});

function newRound(players, msg){
	msg.channel.send("Alright, time for another round!");
	msg.channel.send(this.dealer.name + " is shuffling the cards...");
	this.deck = newDeck;
	shuffleDeck(this.deck);
	//Remove all the cards from the players
	for(var x in players){
		x.cards = [];
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

		this.deck[location1] = deck[location2];
		this.deck[location2] = tmp;
	}
}

function endRound(players, msg){
	while(getDealerTotal() < 17){
		var cardDealt = this.dealCard();
		this.dealer.cards[this.dealer.cards.length] = addTotal(this.dealer, cardDealt);
		msg.channel.send("I got a "  + game.deck[cardDealt]);
		msg.channel.send("My new total is: " + this.dealer.total);
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
	return this.dealer.total;
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

client.login("NzAyNjA1MDYyNDIxMzQ4OTEy.XqCd-Q.BJJcPMdgreJ08TmmNZ91khftzKM");