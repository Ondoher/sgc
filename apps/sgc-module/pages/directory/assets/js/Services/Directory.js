Package('SgcModule.Services', {
	Directory : new Class({
		implements : ['get', 'add'],

		initialize : function()
		{
			SYMPHONY.services.make('directory', this, this.implements, true);
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));

			this.directory = {};
		},

		onReady : function()
		{
			SAPPHIRE.application.showPage('directory');
		},

		get : function()
		{
			return JSON.parse(JSON.stringify(this.directory));
		},

		add : function(game)
		{
			console.log('add', game);
			this.directory[game.name] = game;
			this.fire('update');
		}
	})
});

new SgcModule.Services.Directory();
