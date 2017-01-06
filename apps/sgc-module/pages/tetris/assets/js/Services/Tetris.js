Package('SgcModule.Services', {
	Tetris : new Class({
		implements : ['play'],

		initialize : function()
		{
			SYMPHONY.services.make('tetris', this, this.implements, true);

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			var game = {
				image: SGC_MODULE.baseUrl + 'sgc-module/pages/tetris/assets/images/tetris-tile.jpg',
				name: 'Quadroids',
				service: 'tetris',
			};

			this.directoryService = SYMPHONY.services.subscribe('directory');
			this.directoryService.add(game);
		},

		play : function(game)
		{
			SAPPHIRE.application.showPage('tetris');
		}
	})
});

new SgcModule.Services.Tetris();
