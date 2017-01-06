Package('SgcModule.Controllers', {
	Tetris : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'tetris', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'tetris', this.onShow.bind(this));
		},

		onLoad : function(selector)
		{
			this.game = new SgcModule.Engines.Tetris();
			this.game.listen('update', this.onUpdate.bind(this));
			this.view = new SgcModule.Views.Tetris(CONFIGURATION, selector);
			this.view.listen('move', this.onMove.bind(this));
			this.view.listen('rotate', this.onRotate.bind(this));
			this.view.listen('down', this.onDown.bind(this));
			this.view.listen('harddown', this.onHardDown.bind(this));
			this.view.listen('hold', this.onHold.bind(this));
			this.view.listen('new-game', this.onNewGame.bind(this));
		},

		onShow : function(panel, query)
		{
			this.view.newGame();
			this.game.newGame();
		},

		onUpdate : function(type, data)
		{
			this.view.update(type, data);
		},

		onMove : function(direction)
		{
			this.game.move(direction);
		},

		onRotate : function(direction)
		{
			this.game.rotate(direction);
		},

		onDown : function()
		{
			this.game.down();
		},

		onHardDown : function()
		{
			this.game.doHardDown();
		},

		onHold : function()
		{
			this.game.hold();
		},

		onNewGame : function()
		{
			this.view.newGame();
			this.game.newGame();
		},

	})
});

SAPPHIRE.application.registerController('tetris', new SgcModule.Controllers.Tetris());
