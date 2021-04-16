Package('SgcModule.Services', {
	Bootstrap : new Class({
		implements: ['exportService', 'importService', 'getUserId'],

		initialize : function()
		{
			this.serviceName = 'sgc-module:bootstrap';
			this.exportServices = [];
			this.importServices = ['ui', 'modules']

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		exportService : function(name)
		{
			this.exportServices.push(name);
		},

		importService : function(name)
		{
			this.importServices.push(name);
		},

		setTheme : function(theme)
		{
			$(document.body).removeClass(theme.classes.join(' '));
			$(document.body).addClass(theme.name);
			$(document.body).addClass(theme.size);
		},

		getUserId : function()
		{
			return this.userId;
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					this.setTheme(data.themeV2);
					SGC_MODULE.pod = data.pod;
					SGC_MODULE.events.fire('started');
					done();
				}.bind(this))
		},

		onReady : function()
		{
			return SYMPHONY.application.connect(SGC_MODULE.appId, this.importServices, this.exportServices)
				.then(function(response)
				{
					this.userId = response.userReferenceId;
					this.uiService = SYMPHONY.services.subscribe('ui');
					this.modulesService = SYMPHONY.services.subscribe('modules');

					this.uiService.listen('themeChangeV2', this.onThemeChange.bind(this));

					SGC_MODULE.events.fire('start');
				}.bind(this))
				.done();
		},

		onThemeChange : function(theme)
		{
			this.setTheme(theme);
		},
	})
});

new SgcModule.Services.Bootstrap();
