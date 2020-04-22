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
	deck = newDeck;
	shuffleDeck(deck);
	//Remove all the cards from the players
	for(var x in players){
		x.cards = [];
	}
}

function dealCard(){
	
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

function getChips() {
	return this.startingChips;
}

function getTurn() {
	return this.currentTurn;
}

function setTurn(turn) {
	this.currentTurn++;
}