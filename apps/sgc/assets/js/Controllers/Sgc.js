Package('Sgc.Controllers', {
	Sgc : new  Class({
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
			this.view = new Sgc.Views.Sgc();
		}
	})
});

SAPPHIRE.application.registerController('sgc', new Sgc.Controllers.Sgc());
