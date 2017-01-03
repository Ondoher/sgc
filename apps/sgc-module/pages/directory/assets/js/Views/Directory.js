Package('SgcModule.Views', {
	Directory : new Class({
		Extends : Sapphire.View,

		initialize : function(selector)
		{
			this.root = selector;
			this.parent();
		},

		draw : function(directory)
		{
			var container = this.root.find('.directory-container');
			Object.each(directory, function(game)
			{
				var template = SAPPHIRE.templates.get('directory-card');
				template.find('.game-name').text(game.name);
				template.find('.game-image').attr('src', game.image);
				template.click(this.onGameClick.bind(this, game));

				container.append(template);
			}, this);
		},

		onGameClick : function(game)
		{
			var service = SYMPHONY.services.subscribe(game.service);
			if (!service) return;

			service.invoke('play', game);
		}
	})
});
