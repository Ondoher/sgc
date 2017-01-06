Package('SgcModule.Services', {
	Tetris : new Class({
		implements : ['play'],

		initialize : function()
		{
			SYMPHONY.services.make('klondike', this, this.implements, true);

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			var game = {
				image: SGC_MODULE.baseUrl + 'sgc-module/pages/klondike/assets/images/klondike-tile.jpg',
				name: 'Solitaire',
				service: 'klondike',
			};

			this.directoryService = SYMPHONY.services.subscribe('directory');
			this.directoryService.add(game);
		},

		play : function(game)
		{
			SAPPHIRE.application.showPage('klondike');
		}
	})
});

new SgcModule.Services.Tetris();
