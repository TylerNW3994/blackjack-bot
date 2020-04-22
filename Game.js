var dealer = {};
var newDeck = {"A", "A", "A", "A",
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
			"K", "K", "K", "K"}
var deck = newDeck;
const LOST = -1, TIE = 0, WON = 1;

function Game(startingChips) {
	var nameChance = Math.floor((Math.random() * 10) + 1);
	var name = "";
	switch(nameChance){
		case 1: name = "Mike";
		case 2: name = "Shaniqua";
		case 3: name = "Franklin";
		case 4: name = "Mila";
		case 5: name = "Chad";
		case 6: name = "Hannah";
		case 7: name = "Chris";
		case 8: name = "Lee";
		case 9: name = "Mikayla";
		case 10: name = "Ben";
	}
	this.startingChips = startingChips;
	this.currentTurn = 0;
	this.dealer.name = name;
}

function newRound(players){
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

function endRound(players){
	while(this.dealer.total < 17){
		var cardDealt = this.dealCard();
		this.dealer.cards[this.dealer.cards.length] = addTotal(dealer, cardDealt);
		message.channel.send("I got a "  + game.deck[cardDealt]);
		message.channel.send("My new total is: " + currentPlayer.total);
	}
	
	//Dealer bust
	if(this.dealer.total > 21){
		message.channel.send("I bust!  You all win!");
		for(var x in players){
			x.win = true;
		}
	}
	
	//Dealer didn't bust but stayed past or at 17
	else{
		for(var x in players){
			//Player won
			if(x.total > this.dealer.total){
				x.chips += x.bet;
				message.channel.send(x + " won!  New chips amount: " + x.chips);
			}
			//Player tied
			else if(x.total == this.dealer.total){
				message.channel.send(x + " and I tied.  No change in chips!");
			}
			//Player lost
			else if(x.total < this.dealer.total){
				x.chips -= x.bet;
				message.channel.send(x + " lost!  New chips amount: " + x.chips);
			}
			//ERROR
			else {
				message.channel.send("Tyler, there\'s a mistake determining who won.");
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