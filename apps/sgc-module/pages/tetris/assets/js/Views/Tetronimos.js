Package('SgcModule.Views', {
	Tetronimos : new Class({
		initialize : function(config, field, shadow)
		{
			this.x = -1;
			this.y = -1;
			this.height = -1;

			this.tilePath = config.tilePath;
			this.tileImageNames = config.tileImages;
			this.tileWidth = config.tileWidth;
			this.tileHeight = config.tileHeight;

			this.smallTilePath = config.smallTilePath;
			this.smallTileImages = config.smallTileImages;
			this.smallTileWidth = config.smallTileWidth;
			this.smallTileHeight = config.smallTileHeight;

			this.tileClass = config.tileClass;

			this.piece = $('<div>');
			this.piece.css('visibility', 'hidden');
			this.piece.css('position', 'absolute');
			this.piece.css('z-index', 2);
			if (shadow) this.piece.css('opacity', 0.25);
			field.append(this.piece);

			this.field = field;
			this.hidden = true;
		},

		//----------------------------------------------------------------------------

		removeDiv : function(div)
		{
			if (typeof div === 'string') div = this.root.find('#' + div);
			div.remove();
		},

		//----------------------------------------------------------------------------

		addImg : function(div, imgSrc, imgClass, url, id)
		{
			var img = $('<img>');

			if (url)
			{
				var link = $('<a href="javascript:void(0)">');
				link.attr('href', url);
			}

			img.addClass(imgClass);
//			img.border=0;
			img.attr('src', imgSrc);
			if (id) img.attr('id', id);

			if (url)
			{
				link.append(img);
				div.append(link);
			}
			else
				div.append(img);

			return img;
		},

		//----------------------------------------------------------------------------

		updateTile : function(tile, face)
		{
			var y = Math.floor(tile / this.height);
			var x = Math.floor(tile % this.height);

			if (this.tileCurrent[tile] === face) return;

			if (face === 0)
			{
				if (this.tileFaces[tile]) this.removeDiv(this.tileFaces[tile])
				delete this.tileFaces[tile];
			}
			else if (this.tileFaces[tile])
				this.tileImages[tile].attr('src', this.tilePath + this.tileImageNames[face]);
			else
				this.tileFaces[tile] = this.addTile(tile, x, y, face);

			this.tileCurrent[tile] = face;

		},

		//----------------------------------------------------------------------------

		drawBlock : function(row, col, face)
		{
			var tile = row * this.height + col;

			if (row >= 0) this.updateTile(tile, face);
		},

		//----------------------------------------------------------------------------

		addTile : function(tile, x, y, face)
		{
			var left = x * this.tileWidth;
			var top = y * this.tileHeight;

			var tileEl = $('<div>');

		// add all the faces, make the blank face current
			tileEl.attr('id', 'piece-tile-' + tile + '-' + face);
			tileEl.addClass('tile');
			tileEl.css('position', 'absolute');
			tileEl.css('left', left + 'px');
			tileEl.css('top', top + 'px');

			this.tileImages[tile] = this.addImg(tileEl, this.tilePath + this.tileImageNames[face], this.tileClass);

			this.piece.append(tileEl);
			return tileEl;
		},

		//----------------------------------------------------------------------------

		createPiece : function(matrix)
		{
		// need a new piece
			this.height = matrix.length;
			this.tileFaces = makeArray(matrix.length * matrix.length, undefined);
			this.tileImages = makeArray(matrix.length * matrix.length, '');
			this.tileCurrent = makeArray(matrix.length * matrix.length, 0);

			this.piece.html('');
			this.piece.css('width', (matrix.length * this.tileWidth) + 'px');
			this.piece.css('height', (matrix.length * this.tileHeight) + 'px');

			this.hidden = true;
			this.piece.css('visibility', 'hidden');
		},

		//----------------------------------------------------------------------------

		reset : function()
		{
			for (var idx = 0; idx < this.height * this.height; idx++)
				this.updateTile(idx, 0);
		},

		//----------------------------------------------------------------------------

		draw: function (spec)
		{
			var y = spec[0];
			var x = spec[1];
			var matrix = [];
			var row, col;

			if (spec[2] === undefined) return;

			for (var idx = 0; idx < spec[2].length; idx++)
				matrix.push(spec[2][idx].slice(0));

			if (matrix.length != this.height) this.createPiece(matrix);

			if (this.hidden) this.piece.css('visibility', 'visible');
			this.hidden = false;

			for (row = 0; row < matrix.length; row++)
				for (col = 0; col < matrix[row].length; col++)
				{
					if (y + row < 0 && matrix[row][col] !== 0)
						matrix[row][col] = 0;
					this.drawBlock(row, col, matrix[row][col]);
				}

			if (this.x != x) this.piece.css('left', (x * this.tileWidth) + 'px');
			if (this.y != y) this.piece.css('top', (y * this.tileHeight) + 'px');

			this.x = x;
			this.y = y;
		},

		hide : function()
		{
			this.piece.css('visiblity', 'hidden');
			this.hidden = true;
		}
	})
});

