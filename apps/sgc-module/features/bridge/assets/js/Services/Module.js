var POD_ID;

window.addEventListener("message", function(msg)
{
	if (msg.data && msg.data.pod) POD_ID = msg.data.pod;
}, false);

Package('Sgc.Services', {
	Module : new Class({
		implements : ['link'],

		initialize : function()
		{
			SYMPHONY.services.make('sgc:module', this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
			SAPPHIRE.application.listen('share', this.onShare.bind(this));
			this.thumb = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzExMSA3OS4xNTgzMjUsIDIwMTUvMDkvMTAtMDE6MTA6MjAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY1NDNEOTc2RDNCRTExRTY5NjMwRDdFNDlCMEU5RkNBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY1NDNEOTc1RDNCRTExRTY5NjMwRDdFNDlCMEU5RkNBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iMEY4NjlEQzM0OTg5RUU5MDgyODNGMUQzMjlCMEI4NjgiIHN0UmVmOmRvY3VtZW50SUQ9IjBGODY5REMzNDk4OUVFOTA4MjgzRjFEMzI5QjBCODY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwM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';
		},

		link : function(type, id)
		{
			SAPPHIRE.application.showPage('mj', id, Math.random());
			SAPPHIRE.application.fire('linked');
		},

		getAppId : function(podId)
		{
			var exceptions = SGC_MODULE.podAppIdExceptions || {};

			return exceptions[podId] || 'sgc';
		},

		setTheme : function(theme)
		{
			console.log('theme', theme);
			$(document.body).removeClass(theme.classes.join(' '));
			$(document.body).addClass(theme.name);
			$(document.body).addClass(theme.size);
		},

		setupController : function()
		{
			this.controllerService.connect('sgc:module')
				.then(function(response)
				{
				});
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					this.pod = data.pod || POD_ID;
					this.appId = this.getAppId(this.pod);
					this.setTheme(data.themeV2);
					done();
				}.bind(this));
		},

		onReady : function()
		{
			return SYMPHONY.application.connect(this.appId, ['ui', 'modules', 'applications-nav', 'share'], ['sgc:module'])
				.then(function()
				{
					this.uiService = SYMPHONY.services.subscribe('ui');
					this.navService = SYMPHONY.services.subscribe('applications-nav');
					this.modulesService = SYMPHONY.services.subscribe('modules');
					this.shareService = SYMPHONY.services.subscribe('share');
					this.controllerService = SYMPHONY.services.subscribe('sgc:controller');
					this.setupController();

					this.uiService.listen('themeChangeV2', this.onThemeChange.bind(this));
				}.bind(this))
				.done();
		},

		onThemeChange : function(theme)
		{
			this.setTheme(theme);
		},

		shareArticle : function(gameNbr, time)
		{
			var fullTime = time;
			console.log('sharing, w00t!', gameNbr, time);
			var hours = Math.floor(time / 60 / 60 / 1000);
			time -= hours * 60 * 60 * 1000;
			var minutes = Math.floor(time / 60 / 1000);
			time -= minutes * 60 * 1000;
			var seconds = Math.floor(time / 1000);
			var duration = hours.toString() + ':' + minutes.toString().pad(2, '0', 'left') + ':' + seconds.toString().pad(2, '0', 'left');
			var article = {
				title : 'Somebody you know won at Mah Jongg Solitaire',
				blurb: 'Click here to beat their time of ' + duration,
				date : new Date().getTime() / 1000,
				thumbnail: this.thumb,
				id: JSON.stringify({gameNbr: gameNbr, time: fullTime})
			};

			console.log('sharing this', article);
			this.shareService.share('article', article);
		},

		sharePresentationML : function(gameNbr, time)
		{
			var fullTime = time;
			console.log('sharing, w00t!', gameNbr, time);
			var hours = Math.floor(time / 60 / 60 / 1000);
			time -= hours * 60 * 60 * 1000;
			var minutes = Math.floor(time / 60 / 1000);
			time -= minutes * 60 * 1000;
			var seconds = Math.floor(time / 1000);
			var duration = hours.toString() + ':' + minutes.toString().pad(2, '0', 'left') + ':' + seconds.toString().pad(2, '0', 'left');

			var title = 'Somebody you know won at Mah Jongg Solitaire';
			var blurb = 'try to beat their time of ' + duration;
			var date = new Date().getTime() / 1000;
			var thumbnail = this.thumb;
			var id = JSON.stringify({gameNbr: gameNbr, time: fullTime});

			var presentationML =`
					<entity>
						<table><tr>
							<td><img src="${thumbnail}" /></td>
							<td>
								<h1>${title}</h1>
								${blurb}
							</td>
						</tr></table>
					</entity>`;

			var entityJSON = {
				date: date,
				thumbnail: thumbnail,
				results: id,
			};

			var data = {
				plaintext: `*${title}*\n${blurb}\n`,
				presentationML : presentationML,
				entityJSON: entityJSON,
				entity: {},
				format: 'com.symphony.messageml.v2',
			}
			this.shareService.share('com.symfuny.invite.won', data);
		},

		onShare : function(gameNbr, time)
		{
			this.sharePresentationML(gameNbr, time);
		}

	})
});

new Sgc.Services.Module();
