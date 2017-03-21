var POD_ID;

window.addEventListener("message", function(msg)
{
	if (msg.data && msg.data.pod) POD_ID = msg.data.pod;
}, false);

Package('Sgc.Services', {
	Controller : new Class({
		implements : ['select', 'link', 'connect'],

		initialize : function()
		{
			SYMPHONY.services.make('sgc:controller', this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		getAppId : function(podId)
		{
			var exceptions = SGC.podAppIdExceptions || {};

			return exceptions[podId] || 'sgc';
		},

		select : function(id)
		{
			var options = {
				canFloat: true
			};

			this.modulesService.show('sgc-games', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller', SGC.baseUrl + 'sgc-module', options);
		},

		link : function(type, id)
		{
			var options = {
				canFloat: true
			};

			if (this.module)
				this.module.invoke('link', type, id);
			else
			{
				this.pendingCommands = this.pendingCommands || [];
				this.pendingCommands.push({cmd: 'link', type: type, id: id});
				this.modulesService.show('sgc-games', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller', SGC.baseUrl + 'sgc-module', options);
			}
		},

	// called by the module when it loads
		connect : function(serviceName)
		{
			return SYMPHONY.remote.subscribe(serviceName)
				.then(function(service)
				{
					this.module = service;

				// This event is fired when the module goes away
					service.listen('disconnected', this.onModuleDisconnected.bind(this));

					var pending = this.pendingCommands.pop();
					this.pendingCommands = [];

					if (pending) service.invoke(pending.cmd, pending.type, pending.id);
				}.bind(this));
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					console.log(data);
					this.pod = data.pod || POD_ID;
					this.appId = this.getAppId(this.pod);
					done();
				}.bind(this))
				.done();
		},

		onReady : function()
		{
			console.log('this.appId', this.appId);
			return SYMPHONY.application.register(this.appId, ['ui', 'modules', 'applications-nav', 'share'], ['sgc:controller'])
				.then(function()
				{
					this.uiService = SYMPHONY.services.subscribe('ui');
					this.navService = SYMPHONY.services.subscribe('applications-nav');
					this.modulesService = SYMPHONY.services.subscribe('modules');
					this.shareService = SYMPHONY.services.subscribe('share');

					this.shareService.handleLink('article', 'sgc:controller');

					this.navService.add('sgc', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller');
				}.bind(this))
				.done();
			{
			}
		},

		onModuleDisconnected : function(symbol)
		{
			this.module = undefined;
		},
	})
});

new Sgc.Services.Controller();
