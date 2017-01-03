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
			var game = {
				image: SGC_MODULE.baseUrl + 'sgc-module/pages/mj/assets/images/mj-image.jpg',
				name: 'Mah Jongg Solitaire',
				service: 'mj',
			};

			this.directoryService = SYMPHONY.services.subscribe('directory');
			this.directoryService.add(game);
		},

		play : function(game)
		{
			SAPPHIRE.application.showPage('mj');
		}
	})
});

new SgcModule.Services.Mj();
