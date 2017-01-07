Package('Sparcade.Views', {
	MahJongg : new Class({

		Extends : Sapphire.View,

		defaultTileset :
		{
			name : 'Ivory Tiles',
			image : '/sparcade/assets/images/tilesets/ivory/dragon-r.png',
			description : '',
			tiles : 144,
			css: ''
		},

		initialize : function(root)
		{
			this.parent();

			this.root = root;

		// Get various document elements
			this.root.find('#mj-hint-button').click(this.fire.bind(this, 'hint'));
			this.root.find('#mj-undo-button').click(this.fire.bind(this, 'undo'));
			this.root.find('#mj-redo-button').click(this.fire.bind(this, 'redo'));
			this.root.find('#mj-new-button').click(this.fire.bind(this, 'new'));
			this.root.find('#mj-solve-button').click(this.fire.bind(this, 'solve'));
			this.root.find('#mj-share-button').click(this.fire.bind(this, 'share'));

			//$('#mj-board-nbr').click
			this.gameBoardDiv = this.root.find('#mj-game-board');
			this.layoutDiv = this.root.find('#mj-layout');
			this.messageDiv = this.root.find('#mj-message');
			this.shortMessageDiv = this.root.find('#mj-small-message');
			this.tilesLeftDiv = this.root.find('#mj-tiles-left');
			this.timeDiv = this.root.find('#mj-timer');
			this.timeToBeatDiv = this.root.find('#mj-to-beat');

			this.setTileset();
			this.tiles = [];
		},

		getDuration : function(time)
		{
			var hours = Math.floor(time / 60 / 60 / 1000);
			time -= hours * 60 * 60 * 1000;
			var minutes = Math.floor(time / 60 / 1000);
			time -= minutes * 60 * 1000;
			var seconds = Math.floor(time / 1000);

			return hours.toString() + ':' + minutes.toString().pad(2, '0', 'left') + ':' + seconds.toString().pad(2, '0', 'left');
		},

		drawTime : function(time)
		{
			var duration = this.getDuration(time);
			this.timeDiv.text(duration);
		},

		drawToBeat : function(time)
		{
			var duration = this.getDuration(time);
			this.timeToBeatDiv.text(duration);
		},

		clearCountDown : function()
		{
			$("html").removeClass('counting-down');
			this.root.find('#countdown').html('');
			this.clearedCountDown = true;
		},

		drawCountDown : function(time)
		{
			this.clearedCountDown = false;
			$("html").addClass('counting-down');
			var hours = Math.floor(time / 60 / 60 / 1000);
			time -= hours * 60 * 60 * 1000;
			var minutes = Math.floor(time / 60 / 1000);
			time -= minutes * 60 * 1000;
			var seconds = Math.floor(time / 1000);

			var duration = hours.toString() + ':' + minutes.toString().pad(2, '0', 'left') + ':' + seconds.toString().pad(2, '0', 'left');

			if (duration === this.countdownStr) return;
			this.countdownStr = duration;

			this.root.find('#countdown').removeClass('pulse');
			setTimeout(function()
			{
				if (!this.clearedCountDown)
					this.root.find('#countdown').addClass('pulse');
			}.bind(this), 25);

			this.root.find('#countdown').html(this.countdownStr);
		},

		drawState : function(tileCount, canUndo, canRedo)
		{
		},

		showTile : function(tile, on)
		{
			if (on)
				this.tiles[tile].show();
			else
				this.tiles[tile].hide();
		},

		hintTile : function(tile, on)
		{
			this.highlightTile(tile, on);
		},

		getHighlight : function()
		{
			var highlight = $('<img class="tile-highlight"/>');
			highlight.attr('src', this.tileset.highlight);
			highlight.css({position: 'absolute', top: '0px', left: '0px'});

			return highlight;
		},

		highlightTile : function(tile, on)
		{
			if (on) this.tiles[tile].addClass('highlight');
			else this.tiles[tile].removeClass('highlight');
		},

		message : function(message)
		{
			if (!message)
				this.root.find('#message').addClass('hidden');
			else
				this.root.find('#message').removeClass('hidden');

			this.root.find('#message').html(message);
		},

		shortMessage : function(message)
		{
		},

		addTile : function(idx, x, y, z, face)
		{
			var canvas = $('#board-canvas');

			var tile = SAPPHIRE.templates.get('tile');
			tile.addClass('pos-' +	x + '-' + y + '-' + z);
			tile.addClass('face-' +	 face);
			tile.click(this.fire.bind(this, 'select', idx));

			canvas.append(tile);
			this.tiles[idx] = tile;
		},

		clearBoard : function()
		{
			this.timeToBeatDiv.text('');
			this.root.removeClass('won');
			this.root.removeClass('to-beat');
			$('#board-canvas').empty();
			this.tiles = [];
		},

		setTileset : function (tileset)
		{
			this.tileset = (tileset !== undefined)?tileset:this.defaultTileset;
			$('#board-canvas').addClass('ivory');
		},

		won : function()
		{
			this.root.addClass('won');
		},

		toBeat : function(time)
		{
			this.root.addClass('to-beat');
			this.drawToBeat(time);
		},
	})
});

