Package('SgcModule.Engines', {
	Klondike : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.deck = new SgcModule.Engines.Deck();

			this.newGame()
		},

		pushGame : function()
		{
			var stock = Array.clone(this.stock);
			var waste = Array.clone(this.waste);
			var foundation = Array.clone(this.foundation);
			var tableau = Array.clone(this.tableau);
			var moves = Object.clone(this.validMoves);
			var wasteVisible = this.wasteVisible;

			this.stack.push({stock: stock, waste: waste, foundation: foundation, tableau: tableau, moves: moves, wasteVisible: wasteVisible});
		},

		popGame : function()
		{
			var state = this.stack.pop();

			this.stock = state.stock;
			this.waste = state.waste;
			this.foundation = state.foundation;
			this.tableau = state.tableau;
			this.validMoves = state.moves;
			this.wasteVisible = state.wasteVisible;
		},

		newGame : function()
		{
			this.deck.shuffle();
			this.tableau = [];
			this.stack = [];

			var toDeal = 1;
			var idx = 0;
			for (var column = 0; column < 7; column++)
			{
				this.tableau[column] = [];
				for (var card = 0; card < toDeal; card++)
				{
					var up = (card == toDeal - 1);
					var which = this.deck.dealOne();
					this.tableau[column].push({card: which, up: up, identity: this.deck.identify(which)});
				}
				toDeal++;
			}

			this.foundation = [[], [], [], []];

			this.stock = this.deck.deal(24, true);
			this.waste = [];

			this.dealStock();

			this.validMoves = $H({});

			this.calcMoves();
		},

		resetStock : function()
		{
			this.stock = this.waste;
			this.stock.reverse();
			this.waste = [];
		},

		dealStock : function()
		{
			var pullCount = Math.min(this.stock.length, 3);

			for (var idx = 0; idx < pullCount; idx++)
				this.waste.push(this.stock.pop());

			this.wasteVisible = pullCount;
			this.calcMoves();
		},

		getVisibleWaste : function()
		{
			return this.waste.slice(this.waste.length - this.wasteVisible, this.waste.length);
		},

		getEndCards : function()
		{
			var cards = [];
			for (var idx = 0; idx < 7; idx++)
			{
				if (this.tableau[idx].length > 0)
					cards.push(this.tableau[idx].getLast().card);
				else
					cards.push(null);
			}

			return cards;
		},

		getTableauUp : function()
		{
			var cards = [];

			this.tableau.each(function(column, which)
			{
				cards[which] = [];
				column.each(function(card, idx)
				{
					if (card.up)
						cards[which].push(card.card);
				}, this);
			}, this);

			return cards;
		},

		getWasteCard : function()
		{
			return this.waste.getLast();
		},

		getFoundationTops : function()
		{
			var cards = [];
			for (var idx = 0; idx < 4; idx++)
				cards.push(this.foundation[idx].getLast());

			return cards;
		},

		isSameSuit : function(card1, card2)
		{
			var identity1 = this.deck.identify(card1);
			var identity2 = this.deck.identify(card2);

			return identity1.suit == identity2.suit;
		},

		isOtherColor : function(card1, card2)
		{
			var identity1 = this.deck.identify(card1);
			var identity2 = this.deck.identify(card2);

			return identity1.color != identity2.color;
		},

		calcPlays : function(source, check)
		{
			check = (check === undefined)?['foundation', 'tableau']:check;
			var positions = $H({});
			var endCards = this.getEndCards();
			var foundation = this.getFoundationTops();
			var sourceIdentity = this.deck.identify(source);

		// check foundation
			if (check.indexOf('foundation') != -1)
			{
				foundation.each(function(destination, idx)
				{
					if (sourceIdentity.faceName == 'ace' && destination == null)
					{
						positions[0 - (idx + 10)] = {where: 'foundation', which: idx};
					}
					else if (destination != null)
					{
						var destIdentity = this.deck.identify(destination.card);
						if (sourceIdentity.face - 1 == destIdentity.face && this.isSameSuit(source, destination.card))
						{
							positions[destination.card] = {where: 'foundation', which: idx, card: destIdentity};
						}
					}
				}, this);
			}

		// check tableau
			if (check.indexOf('tableau') != -1 && sourceIdentity.faceName != 'ace')
			{
				endCards.each(function(destination, idx)
				{
					if (destination == null && sourceIdentity.faceName == 'king')
						positions[0 - (idx + 1)] = {where: 'tableau', which: idx, card: destIdentity};
					else if (destination != null)
					{
						var destIdentity = this.deck.identify(destination);
						if (sourceIdentity.face + 1 == destIdentity.face && this.isOtherColor(source, destination))
						{
							positions[destination] = {where: 'tableau', which: idx, card: destIdentity};
						}
					}
				}, this);
			}

			return positions;
		},

		calcMoves : function(checkUseful)
		{
			checkUseful = (checkUseful == undefined)?false:checkUseful;

		// collect all visible tableau cards and see if they can be dragged to an end point
		// when checkUseful is set, only return middle tableu drags that result in a new playable card
			var moves = $H({});
			var tableauCards = this.getTableauUp();

			tableauCards.each(function(column, which)
			{
				var prev = null;
				column.each(function(card, idx)
				{
					var top = column.length == this.tableau[which].length;
					var first = idx == 0;
					var last = idx == column.length - 1;
					var middle = !first && !last;

					var check = [];
					if (this.deck.identify(card).faceName != 'king' || !checkUseful || !top)
						check = ['tableau'];

					var plays = this.calcPlays(card, check);

					if (checkUseful && !first)
					{
						prevPlays = this.calcPlays(prev);
						if (prevPlays.getLength() == 0)
						{
							plays = $H({});
						}
					}

					if (last)
						plays.extend(this.calcPlays(card, ['foundation']));

					var sourceIdx = this.tableau[which].length - column.length + idx;
					if (plays.getLength() != 0)
						moves[card] = {location: {where: 'tableau', which: which, idx : sourceIdx}, plays: plays, card: this.deck.identify(card)};

					prev = card;
				}, this);
			}, this);

		// check top waste card, compare with all end points
			var wasteCard = this.getWasteCard();
			var plays = (wasteCard != null)?this.calcPlays(wasteCard.card):$H({});

			if (plays.getLength() != 0)
			{
				moves[wasteCard.card] = {location: {where: 'waste'}, plays: plays, card: wasteCard};
			}

			if (!checkUseful) this.validMoves = moves;

			return moves;
		},

		isEndGame : function()
		{
		// deal entire stock twice and look for valid moves. stop if a valid move is found and return false;
			var deals = 0;

			this.pushGame();

			do
			{
				var moves = this.calcMoves(true);

				if (this.stock.length == 0)
				{
					this.resetStock();
					deals++;

				}
				this.dealStock();

			} while (deals <= 2 && moves.getLength() == 0);


			this.popGame();

			console.log(moves);

			return moves.getLength() == 0;
		},

		hasWon : function()
		{
			var won = true;
			this.foundation.each(function(column)
			{
				won = won && column.length == 13;
			}, this);

			return won;
		},

		canPlay : function(source, dest)
		{
			if (!this.validMoves.has(source)) return false;
			if (!this.validMoves[source].plays.has(dest)) return false;

			return true;
		},

		play : function(source, dest)
		{
			if (!this.canPlay(source, dest)) return;

			var destLocation = this.validMoves[source].plays[dest];
			var sourceLocation = this.validMoves[source].location;

			cards = [];
			if (sourceLocation.where == 'tableau')
			{
				var length = this.tableau[sourceLocation.which].length;
				var count = length - sourceLocation.idx;

				start = sourceLocation.idx;
				for (var idx = 0; idx < count; idx++)
					cards.push(this.tableau[sourceLocation.which][start + idx].card);

				this.tableau[sourceLocation.which].splice(length - count, count);
				length -= count;

				if (length != 0)
					this.tableau[sourceLocation.which][length - 1].up = true;
			}

			if (sourceLocation.where == 'waste')
			{
				cards.push(this.getWasteCard().card);
				this.waste.pop();

				this.wasteVisible--;
				this.wasteVisible = Math.max(1, this.wasteVisible);

				if (this.waste.length == 0) this.wasteVisible = 0;
			}

			if (destLocation.where == 'tableau')
			{
				cards.each(function(card)
				{
					this.tableau[destLocation.which].push({card: card, identity: this.deck.identify(card), up: true});
				}, this);
			}

			if (destLocation.where == 'foundation')
			{
				cards.each(function(card)
				{
					this.foundation[destLocation.which].push({card: card, identity: this.deck.identify(card)});
				}, this);
			}

			this.calcMoves();

		// find source card, verify it is playable
		// find destination card, verify it is available and identify match type
		// verify the match
		// update internal states
		},

		getMoves : function(card)
		{
			if (!this.validMoves.has(card)) return $H({});
			else return this.validMoves[card].plays;
		}
		})
});


