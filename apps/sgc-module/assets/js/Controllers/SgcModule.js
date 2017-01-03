Package('SgcModule.Controllers', {
	SgcModule : new  Class({
		Extends: Sapphire.Controller,

		initialize : function()
		{
			this.parent();
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onStart : function(callback)
		{
			callback();
		},

		onReady : function()
		{
			this.view = new SgcModule.Views.SgcModule();
		}
	})
});

SAPPHIRE.application.registerController('sgc-module', new SgcModule.Controllers.SgcModule());
