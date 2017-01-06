Package('SgcModule.Controllers', {
	Klondike : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'klondike', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('firstShow', 'klondike', this.onFirstShow.bind(this));
		},

		onLoad : function(root)
		{
			this.view = new SgcModule.Views.Klondike(root);
		},

		onFirstShow : function(panel, query)
		{
			this.start();
		},

		start : function()
		{
			this.game = new SgcModule.Engines.Klondike();

			this.view.listen('tableauMouseDown', this.onTableauMouseDown.bind(this));
			this.view.listen('wasteMouseDown', this.onWasteMouseDown.bind(this));

			this.view.listen('tableauMouseUp', this.onTableauMouseUp.bind(this));
			this.view.listen('emptyTableauMouseUp', this.onEmptyTableauMouseUp.bind(this));
			this.view.listen('foundationMouseUp', this.onFoundationMouseUp.bind(this));
			this.view.listen('emptyFoundationMouseUp', this.onEmptyFoundationMouseUp.bind(this));
			this.view.listen('dealStock', this.onDealStock.bind(this));
			this.view.listen('resetStock', this.onResetStock.bind(this));
			this.view.listen('newGame', this.onNewGame.bind(this));

			this.game.newGame();
			this.view.newGame();
			this.draw();
		},

		draw : function()
		{
			if (this.game.hasWon())
				this.view.gameMessage('YOU WIN!');
			else if (this.game.isEndGame())
				this.view.gameMessage('No More Moves!');

			this.view.drawTableau(this.game.tableau);
			this.view.drawFoundation(this.game.getFoundationTops());
			this.view.drawWaste(this.game.getVisibleWaste(), this.game.wasteVisible);
			this.view.drawStock(this.game.stock);
		},

		onTableauMouseDown : function(card, which, idx, event)
		{
			var moves = this.game.getMoves(card.card);
			this.view.startTableauDrag(moves, card, which, idx, event);
		},

		onWasteMouseDown : function(card, which, event)
		{
			var moves = this.game.getMoves(card.card);
			this.view.startWasteDrag(moves, card, which, event);
		},

		onTableauMouseUp : function(card, which, idx, event, dragging)
		{
			var canPlay = this.game.canPlay(dragging.card.card, card.card);
			if (canPlay)
			{
				this.game.play(dragging.card.card, card.card);
				this.draw();
			}
		},

		onEmptyTableauMouseUp : function(which, event, dragging)
		{
			card = 0 - (which + 1);

			var canPlay = this.game.canPlay(dragging.card.card, card);
			{
				this.game.play(dragging.card.card, card);
				this.draw();
			}
		},

		onFoundationMouseUp : function(card, which, event, dragging)
		{
			var canPlay = this.game.canPlay(dragging.card.card, card.card);
			if (canPlay)
			{
				this.game.play(dragging.card.card, card.card);
				this.draw();
			}
		},

		onEmptyFoundationMouseUp : function(which, event, dragging)
		{
			card = 0 - (which + 10);

			var canPlay = this.game.canPlay(dragging.card.card, card);
			{
				this.game.play(dragging.card.card, card);
				this.draw();
			}
		},

		onDealStock : function()
		{
			this.game.dealStock();
			this.draw();
		},

		onResetStock : function()
		{
			this.game.resetStock();
			this.draw();
		},

		onNewGame : function()
		{
			this.game.newGame();
			this.view.newGame();
			this.draw();
		}
	})
});

SAPPHIRE.application.registerController('klondike', new SgcModule.Controllers.Klondike());
