Package('Sgc.Services', {
	Module : new Class({
		implements : [],

		initialize : function()
		{
			SYMPHONY.services.make('sgc:module', this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		setTheme : function(theme)
		{
			console.log('theme', theme);
			$(document.body).removeClass(theme.classes.join(' '));
			$(document.body).addClass(theme.name);
			$(document.body).addClass(theme.size);
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					this.pod = data.pod;
					this.setTheme(data.themeV2);
					done();
				}.bind(this));
		},

		onReady : function()
		{
			return SYMPHONY.application.connect('sgc', ['ui', 'modules', 'applications-nav', ], ['sgc:module'])
				.then(function()
				{
					this.uiService = SYMPHONY.services.subscribe('ui');
					this.navService = SYMPHONY.services.subscribe('applications-nav');
					this.modulesService = SYMPHONY.services.subscribe('modules');

					this.uiService.listen('themeChangeV2', this.onThemeChange.bind(this));
				}.bind(this))
				.done();
			{
			}
		},

		onThemeChange : function(theme)
		{
			this.setTheme(theme);
		},

	})
});

new Sgc.Services.Module();
