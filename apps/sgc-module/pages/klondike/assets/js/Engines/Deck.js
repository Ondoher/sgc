Package('SgcModule.Engines', {
	Deck : new Class({

		suits : ['clubs', 'spades', 'hearts', 'diamonds'],
		faces : ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'],
		colors : ['black', 'red'],

		initialize : function()
		{
			this.shuffle();
		},

		shuffle : function()
		{
			this.cards = [];
			for (var idx = 0; idx < 52; idx++)
			{
				this.cards.push(idx);
			}
		},

		dealOne : function()
		{
			var idx = Math.floor(Math.random() * this.cards.length);
			var card = this.cards[idx];
			this.cards.splice(idx, 1);

			return card;
		},

		deal : function(count, useDescriptors)
		{
			useDescriptors = (useDescriptors == undefined)?false:useDescriptors;
			count = Math.min(count, this.cards.length);
			var cards = [];

			for (idx = 0; idx < count; idx++)
				if (useDescriptors)
					cards.push(this.describe(this.dealOne()));
				else
					cards.push(this.dealOne());

			return cards;
		},

		identify : function(card)
		{
			var face = Math.floor(card % this.faces.length);
			var suit = Math.floor(card / this.faces.length);
			var color = Math.floor(suit / 2);

			return {face: face, faceName: this.faces[face], suit: suit, suitName: this.suits[suit], color: color, colorName: this.colors[color]};
		},

		describe : function(card)
		{
			return {card: card, identity: this.identify(card)};
		}
	})
})
