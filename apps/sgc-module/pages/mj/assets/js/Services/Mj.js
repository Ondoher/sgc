Package('SgcModule.Services', {
	Mj : new Class({
		implements : ['play'],

		initialize : function()
		{
			SYMPHONY.services.make('mj', this, this.implements, true);

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			console.log('onReady');
			var game = {
				image: SGC_MODULE.baseUrl + 'sgc-module/pages/mj/assets/images/mj-image.jpg',
				name: 'Mah Jongg Solitaire',
				service: 'mj',
			};

			this.directoryService = SYMPHONY.services.subscribe('directory');
			console.log('this.directoryService', this.directoryService);
			this.directoryService.add(game);
			console.log('done onReady');
		},

		play : function(game)
		{
			console.log('PLAY GAME!');
		}
	})
});

new SgcModule.Services.Mj();
