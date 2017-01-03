Package('Sgc.Services', {
	Controller : new Class({
		implements : ['select'],

		initialize : function()
		{
			SYMPHONY.services.make('sgc:controller', this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		select : function(id)
		{
			var options = {
				canFloat: true
			};

			this.modulesService.show('sgc-games', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller', SGC.baseUrl + 'sgc-module', options);
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					this.pod = data.pod;
					done();
				}.bind(this))
				.done();
		},

		onReady : function()
		{
			return SYMPHONY.application.register('sgc', ['ui', 'modules', 'applications-nav', ], ['sgc:controller'])
				.then(function()
				{
					this.uiService = SYMPHONY.services.subscribe('ui');
					this.navService = SYMPHONY.services.subscribe('applications-nav');
					this.modulesService = SYMPHONY.services.subscribe('modules');

					this.navService.add('sgc', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller');
				}.bind(this))
				.done();
			{
			}
		}
	})
});

new Sgc.Services.Controller();
