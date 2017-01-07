Package('SgcModule.Services', {
	Words : new Class({
		implements : ['play'],

		initialize : function()
		{
			SYMPHONY.services.make('words', this, this.implements, true);

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			var game = {
				image: SGC_MODULE.baseUrl + 'sgc-module/pages/words/assets/images/words-tile.jpg',
				name: 'Words',
				service: 'words',
			};

			this.directoryService = SYMPHONY.services.subscribe('directory');
			this.directoryService.add(game);
		},

		play : function(game)
		{
			SAPPHIRE.application.showPage('words');
		}
	})
});

new SgcModule.Services.Words();
