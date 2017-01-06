/*
	Copyright 2013 Glenn Anderson

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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

		initialize : function()
		{
			this.parent();

		// Get various document elements
			$('#mj-hint-button').click(this.fire.bind(this, 'hint'));
			$('#mj-undo-button').click(this.fire.bind(this, 'undo'));
			$('#mj-redo-button').click(this.fire.bind(this, 'redo'));
			$('#mj-new-button').click(this.fire.bind(this, 'new'));

			//$('#mj-board-nbr').click
			this.gameBoardDiv = $('#mj-game-board');
			this.layoutDiv = $('#mj-layout');
			this.messageDiv = $('#mj-message');
			this.shortMessageDiv = $('#mj-small-message');
			this.tilesLeftDiv = $('#mj-tiles-left');
			this.timeDiv = $('#mj-time');

			this.setTileset();
			this.tiles = [];
		},

		drawTime : function(time)
		{
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
		},

		shortMessage : function(message)
		{
		},

		addTile : function(idx, x, y, z, face)
		{
			console.log('addTile', idx, x, y, z, face);
			var canvas = $('#board-canvas');

			var tile = SAPPHIRE.templates.get('tile');
			tile.addClass('pos-' +  x + '-' + y + '-' + z);
			tile.addClass('face-' +  face);
			tile.click(this.fire.bind(this, 'select', idx));

			canvas.append(tile);
			this.tiles[idx] = tile;
		},

		clearBoard : function()
		{
			$('#board-canvas').empty();
			this.tiles = [];
		},

		setTileset : function (tileset)
		{
			this.tileset = (tileset !== undefined)?tileset:this.defaultTileset;
			$('#board-canvas').addClass('ivory');

		}
	})
});

