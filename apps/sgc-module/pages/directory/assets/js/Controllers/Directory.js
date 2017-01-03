Package('SgcModule.Controllers', {
	Directory : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'directory', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'directory', this.onShow.bind(this));
		},

		onLoad : function(selector)
		{
			this.view = new SgcModule.Views.Directory(selector);
			this.view.listen('play', this.onPlay.bind(this));
			this.directoryService = SYMPHONY.services.subscribe('directory');
			this.directoryService.listen('update', this.onDirectoryUpdate.bind(this));
		},

		onShow : function(panel, query)
		{
			var directory = this.directoryService.get();
			this.view.draw(directory);
		},

		onDirectoryUpdate : function()
		{
			var directory = this.directoryService.get();
			this.view.draw(directory);
		},

		onPlay : function(game)
		{
			this.directoryService.play(game);
		}
	})
});

SAPPHIRE.application.registerController('directory', new SgcModule.Controllers.Directory());
