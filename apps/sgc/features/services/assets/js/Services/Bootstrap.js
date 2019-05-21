Package('Sgc.Services', {
	Bootstrap : new Class({
		implements: ['exportService', 'importService', 'getUserId', 'setAuthenticateService'],

		initialize : function()
		{
			this.serviceName = 'bootstrap';
			this.exportServices = [];
			this.importServices = [];

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

		getUserId : function()
		{
			return this.userId;
		},

		setAuthenticateService : function(name)
		{
			this.authenticateService = SYMPHONY.services.subscribe(name);
		},

		authenticate : function(appId)
		{
			if (!this.authenticateService) return Q(appId);
			var result = this.authenticateService.invoke('authenticate', SGC.pod, appId);
			if (result === undefined) return Q(appId);
			if (!result.then) return Q(result);
			return result;
		},

		validate : function(response)
		{
			if (!this.authenticateService) return Q(response);
			var result = this.authenticateService.invoke('validate', response);
			if (result === undefined) return Q(response);
			if (!result.then) return Q(result);
			return result;
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					SGC.pod = data.pod;
					console.log('POD=============================================');
					console.log(SGC.pod);
					SGC.events.fire('started');
					done();
				}.bind(this))
		},

		onReady : function()
		{
			this.authenticate(SGC.appId)
				.then(function(auth) {
					if (auth === false)
					{
						SGC.events.fire('auth-failed');
						return;
					}
					SYMPHONY.application.register(auth, this.importServices.unique(), this.exportServices.unique())
						.then(this.validate.bind(this))
						.then(function(response)
						{
							if (response === false)
							{
								SGC.events.fire('auth-failed');
								return;
							}
							this.userId = response.userReferenceId;

							SGC.events.fire('start');
						}.bind(this))
				}.bind(this)).done();
		},
	})
});

new Sgc.Services.Bootstrap();
