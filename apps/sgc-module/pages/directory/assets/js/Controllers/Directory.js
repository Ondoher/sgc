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
			console.log('arguments', arguments);
			this.view = new SgcModule.Views.Directory(selector);
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
		}
	})
});

SAPPHIRE.application.registerController('directory', new SgcModule.Controllers.Directory());
