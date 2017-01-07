Package('SgcModule.Services', {
	BreadCrumbs : new Class({
		implements : ['clear', 'add'],

		initialize : function()
		{
			SYMPHONY.services.make('bread-crumbs', this, this.implements, true);

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));

			this.crumbs = [];
		},

		onReady : function()
		{
			this.crumbsSelector = SAPPHIRE.templates.get('bread-crumbs');
			var content = $('#canvas .main-content');
			content.prepend(this.crumbsSelector);
		},

		drawCrumb : function(crumb)
		{
			var template = SAPPHIRE.templates.get('bread-crumb');
			template.find('.name').text(crumb.name);
			template.click(this.onCrumbClick.bind(this, crumb));
			this.crumbsSelector.append(template);
		},

		clear : function()
		{
		},

		add : function(name, id, service)
		{
			var crumb = {
				pos: this.crumbs.length,
				name: name,
				id: id,
				service: service,
			};

			this.crumbs.push(crumb);

			this.drawCrumb(crumb);
		},

		clear : function()
		{
			this.crumbs = [];
			this.redraw();
		},

		redraw : function()
		{
			this.crumbsSelector.empty();
			this.crumbs.each(function(crumb)
			{
				this.drawCrumb(crumb);
			}, this);
		},

		onCrumbClick : function(crumb)
		{
			var service = SYMPHONY.services.subscribe(crumb.service);
			this.crumbs = this.crumbs.slice(0, crumb.pos);
			this.redraw();

			if (service) service.invoke('crumbClick', crumb.id);
		},
	})
});

new SgcModule.Services.BreadCrumbs();
