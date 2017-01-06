Package('SgcModule.Views', {
	Tetris : new Class({
		Extends : Sapphire.View,

		initialize : function(config, root)
		{
			this.parent();
			this.root = root;

			this.tileClass = 'tile';

			this.tilePath = config.tilePath;
			this.tileImages = config.tileImages;
			this.tileWidth = config.tileWidth;
			this.tileHeight = config.tileHeight;

			this.smallTilePath = config.smallTilePath;
			this.smallTileImages = config.smallTileImages;
			this.smallTileWidth = config.smallTileWidth;
			this.smallTileHeight = config.smallTileHeight;

			this.whoopPath = config.whoopPath;

			this.setupDOM();

			this.images = new Array(ROWS * COLS);
			this.tileFaces = makeArray(ROWS * COLS, 'undefined');
			this.tileCurrent = makeArray(ROWS * COLS, '0');
			this.drawGameBoard();
			this.drawScore(0, 0, '');
			this.drawLevel(10, 1, '');
			this.message('');
		},

		setupDOM : function()
		{
			this.layout = this.root.find('#layout');
			this.layoutDiv = this.root.find('#layout');
			this.gameBoard = this.root.find('#game-board');
			this.messageDiv = this.root.find('#message');
			this.smallMessageDiv = this.root.find('#small-message');
			this.scoreDiv = this.root.find('#score');
			this.goalDiv = this.root.find('#goal');
			this.levelDiv = this.root.find('#level');
			this.timeDiv = this.root.find('#time');
			this.holdDiv = this.root.find('#hold');
			this.holdDiv.onclick = this.holdSelect.bind(this);

			this.leftButtons = this.root.find('#left-buttons')
			this.rightButtons = this.root.find('#right-buttons')

			this.root.find('#play-game').click(this.onPlay.bind(this));
			$(document).keypress(this.keyPress.bind(this));
			$(document).keydown(this.keyDown.bind(this));

		},

		newGame : function()
		{
			this.resetGameBoard();
			this.drawScore(0, 0, '');
			this.drawLevel(10, 1, '');
			this.message('');
			this.animation = false;
			this.holdDiv.click(this.holdSelect.bind(this));
			if (this.layoutOffset == undefined) this.calcLayoutOffset();
		},

		//------------------------------------------------------------------------

		calcLayoutOffset : function()
		{
			var layout =this.layoutDiv[0];
			var offset = layout.offsetLeft;
			var node = layout;

			while (node.offsetParent != null)
			{
				node = node.offsetParent;
				offset += node.offsetLeft;
			}

			this.layoutOffset = offset;
		},

		//------------------------------------------------------------------------

		message : function(message)
		{
			if (message == '') {
				this.messageDiv.html('');
				this.messageDiv.css('background-color', 'red');
				this.messageDiv.css('visibility', 'hidden');
			}
			else
			{
				this.messageDiv.css('visibility', 'visible');
				this.messageDiv.html('<h2>' + message + '</h2>');
			}
		},

		//----------------------------------------------------------------------------

		fadeWhoop : function()
		{
			this.whoopOpacity -= 0.25;
			if (this.whoopOpacity <= 0.0)
			{
				clearInterval(this.whoopInterval);
				this.whoopInterval = undefined;
				this.whoopImage.css('visibility', 'hidden');
			}

			this.whoopImage.css('opacity', this.woopOpacity);
		},

		//----------------------------------------------------------------------------

		whoop : function(xPos, yPos, width, height)
		{
			yPos = yPos * this.tileHeight;
			xPos = xPos * this.tileWidth;
			width = width * this.tileWidth;
			height = height * this.tileHeight;

			this.whoopImage.css('left', xPos + 'px');
			this.whoopImage.css('top', yPos + 'px');
			this.whoopImage.css('width', width + 'px');
			this.whoopImage.css('height', height + 'px');

			this.whoopImage.css('visibility', 'visible');
			this.whoopImage.css('opacity', '1.0');
			this.whoopOpacity = 1.0;

			if (!this.whoopInterval)
				this.whoopInterval = setInterval(this.fadeWhoop.bind(this), 50);
		},

		//----------------------------------------------------------------------------

		fadeSmallMessage : function()
		{
			var opacity = Number(this.smallMessageDiv.css('opacity'));
			console.log('opacity', this.smallMessageDiv.css('opacity'), opacity);
			opacity -= 0.05;
			if (opacity < 0)
			{
				clearInterval(this.fadeInterval);
				this.fadeInterval = undefined;
			}

			this.smallMessageDiv.css('opacity', opacity);
		},

		//----------------------------------------------------------------------------

		smallMessage : function(message)
		{
			if (message === '')
				this.smallMessageDiv.html(message);
			else
				this.smallMessageDiv.html('<center>' + message + '</center>');

			this.smallMessageDiv.css('opacity', '1.0');

			if (!this.fadeInterval)
				this.fadeInterval = setInterval(this.fadeSmallMessage.bind(this), 100);
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
			var y = Math.floor(tile / COLS);
			var x = Math.floor(tile % COLS);

			if (this.tileCurrent[tile] === face) return;
			if (face == 0)
			{
				if (this.tileFaces[tile] !== undefined) this.removeDiv(this.tileFaces[tile])
				this.tileFaces[tile] = undefined;
			}
			else if (this.tileFaces[tile] != undefined) this.tileImageNodes[tile].attr('src', this.tilePath + this.tileImages[face]);
			else this.tileFaces[tile] = this.addTile(tile, x, y, face);

			this.tileCurrent[tile] = face;
		},

		//----------------------------------------------------------------------------

		addTile : function(tile, x, y, face)
		{
			var left = x * this.tileWidth;
			var top = y * this.tileHeight;

			var tileEl = $('<div>');

		// add all the faces, make the blank face current
			tileEl.attr('id', 'tile-' + tile + '-' + face);
			tileEl.addClass('tile');
			tileEl.css('position', 'absolute');
			tileEl.css('left', left + 'px');
			tileEl.css('top', top + 'px');
			this.tileImageNodes[tile] = this.addImg(tileEl, this.tilePath + this.tileImages[face], this.tileClass);

			this.layoutDiv.append(tileEl);
			return tileEl;
		},

		//----------------------------------------------------------------------------

		addOnDeckTile : function(div, ofs, tile, x, y, face)
		{
			var left = x * this.smallTileWidth + ofs;
			var top = y * this.smallTileHeight + ofs;

			var tileEl = $('<div>');

			tileEl.attr('id', 'onDeckTile' + tile);
			tileEl.addClass('tile');
			tileEl.css('position', 'absolute');
			tileEl.css('left', left + 'px');
			tileEl.css('top', top + 'px');

			this.addImg(tileEl, this.smallTilePath + this.smallTileImages[face], this.smallTileClass);
			div.append(tileEl);
		},

		//----------------------------------------------------------------------------

		addHoldTile : function(div, xOfs, yOfs, tile, x, y, face)
		{
			var left = x * this.smallTileWidth + xOfs;
			var top = y * this.smallTileHeight + yOfs;

			var tileEl = $('<div>');

			tileEl.attr('id', 'holdTile' + tile);
			tileEl.addClass('tile');
			tileEl.css('position', 'absolute');
			tileEl.css('left', left + 'px');
			tileEl.css('top', top + 'px');

			var img = this.addImg(tileEl, this.smallTilePath + this.smallTileImages[face], this.smallTileClass);
			img.click(this.holdSelect.bind(this));
			div.append(tileEl);
		},

		//----------------------------------------------------------------------------

		drawBlock : function(row, col, face)
		{
			var tile = row * COLS + col;

			if (row >= 0)
				this.updateTile(tile, face);
		},

		//----------------------------------------------------------------------------

		eraseBlocks : function(spec)
		{
			var y = spec[0];
			var x = spec[1];
			var matrix = spec[2];
			var row, col;

			for (row = 0; row < matrix.length; row++)
				for (col = 0; col < matrix[row].length; col++)
					if (matrix[row][col] != 0) this.drawBlock(y + row, x + col, 0);
		},

		//----------------------------------------------------------------------------

		drawHold : function(matrix)
		{
			var holdDiv = this.holdDiv;
			var row, col;
			var xOffset = (60 - (matrix.length * this.smallTileWidth)) / 2
			var yOffset = (40 - (matrix.length * this.smallTileHeight)) / 2

			holdDiv.html('');

			for (row = 0; row < matrix.length; row++)
				for (col = 0; col < matrix[row].length; col++)
					if (matrix[row][col] != 0)
						this.addHoldTile(holdDiv, xOffset, yOffset, matrix[row].length + col, col, row, matrix[row][col]);
		},

		//----------------------------------------------------------------------------

		drawOnDeck : function(index, matrix)
		{
			var onDeckDiv = this.root.find('#on-deck-' + (index + 1));
			var row, col;
			var xOffset = (48 - (matrix.length * this.smallTileWidth)) / 2
			var yOffset = (48 - (matrix.length * this.smallTileHeight)) / 2

			onDeckDiv.html('');

			for (row = 0; row <matrix.length; row++)
				for (col = 0; col < matrix[row].length; col++)
					if (matrix[row][col] != 0)
						this.addOnDeckTile(onDeckDiv, xOffset, matrix[row].length + col, col, row, matrix[row][col]);
		},

		//----------------------------------------------------------------------------

		drawOnDecks : function(update)
		{
			for (var idx = 0; idx < update.length; idx++)
				this.drawOnDeck(idx, update[idx][2]);
		},

		//----------------------------------------------------------------------------

		drawBlocks : function(eraseEmpty, spec)
		{
			var yPos = spec[0];
			var xPos = spec[1];
			var matrix = spec[2];

			if (matrix == undefined) return;

			for (var row = 0; row < matrix.length; row++)
				for (var col = 0; col < matrix[row].length; col++)
					if (eraseEmpty)
						this.drawBlock(yPos + row, xPos + col, matrix[row][col]);
					else if (matrix[row][col] != 0)
						this.drawBlock(yPos + row, xPos + col, matrix[row][col]);
		},

		//----------------------------------------------------------------------------

		drawLevel : function(goal, level, message)
		{
			this.goalDiv.html('GOAL: ' + goal);
			this.levelDiv.html('LEVEL: ' + level);
			if (message !== '') this.smallMessage(message);
		},

		//----------------------------------------------------------------------------

		drawScore : function(amount, score, comment)
		{
			if (amount !== 0 && comment !== '')
				this.smallMessage(comment + ' ' + amount + ' points');

			this.scoreDiv.html('SCORE: ' + score);
		},

		//----------------------------------------------------------------------------

		update : function(type, update)
		{
			switch (type)
			{
				case DRAWTETRONIMO:
					this.tetronimos.draw(update[0]);
					break;
				case HIDETETRONIMO:
					this.tetronimos.hide();
					break;
				case DRAWSHADOW:
					this.shadowPiece.draw(update[0]);
					break;
				case HIDESHADOW:
					this.shadowPiece.hide();
					break;
				case DRAWBOARD:
					if (update.length === 1)
						this.drawBlocks(true, update[0]);
					else
					{
						this.eraseBlocks(update[0]);
						this.drawBlocks(false, update[1]);
					}
					break;
				case DRAWONDECK:
					this.drawOnDecks(update);
					break;
				case DRAWHOLD:
					this.drawHold(update[2]);
					break;
				case DRAWSCORE:
					this.drawScore(update[0], update[1], update[2]);
					break;
				case DRAWLEVEL:
					this.drawLevel(update[0], update[1], update[2]);
					break;
				case DRAWWHOOP:
					this.whoop(update[0], update[1], update[2], update[3]);
					break;
				case DRAWGAMEOVER:
					this.message('GAME OVER');
					break;
			}
		},

		//----------------------------------------------------------------------------

		resetGameBoard : function()
		{
			for (var idx = 0; idx < ROWS * COLS; idx++)
				this.updateTile(idx, 0);

			this.drawGameBoard();
		},

		//----------------------------------------------------------------------------

		drawGameBoard : function()
		{
			this.removeDiv(this.layoutDiv);
			this.layoutDiv = $('<div>');

		// add whoop image
			this.whoopImage = $('<img>');
			this.whoopImage.css('z-index', 0);
			this.whoopImage.css('position', 'absolute');
			this.whoopImage.css('visibility', 'hidden');
			console.log('this.whoopPath', this.whoopPath);
			this.whoopImage.attr('src', this.whoopPath);

			this.layoutDiv.append(this.whoopImage);
			this.layoutDiv.attr('id', 'layout');
			this.layoutDiv.css('left', ((320 - COLS * this.tileWidth) / 2) + 'px');

			this.gameBoard.append(this.layoutDiv);
			this.gameBoard.css('height', (ROWS * this.tileHeight + 10) + 'px');

		// draw an empty board
			for (var idx = 0; idx < ROWS * COLS; idx++)
			{
				var row = Math.floor(idx / COLS);
				var col = Math.floor(idx % COLS);

				this.tileFaces[idx] = undefined;
			}

			this.tileImageNodes = makeArray(COLS * ROWS);
			this.tetronimos = new SgcModule.Views.Tetronimos(this, this.layoutDiv, false);
			this.shadowPiece = new SgcModule.Views.Tetronimos(this, this.layoutDiv, true);
		},

		move : function(direction)
		{
			this.game.move(direction);
		},

		rotate : function(direction)
		{
			this.game.rotate(direction);
		},

		buttonUpEvt : function(evt, type, button)
		{
			this.fire('buttonup', type, button);
		},

		buttonDownEvt : function(evt, type, button)
		{
			this.fire('buttondown', type, button);
		},

		buttonUp : function(type, button)
		{
			this.fire('buttondown', type, button);
		},

		buttonDown : function(type, button)
		{
			this.fire('buttondown', type, button);
		},

		keyDown : function(event)
		{
			if (this.gameOver) return true;
			var keyID = event.keyCode;
			var handled = true;
			switch(keyID)
			{
				case 37:
					this.fire('move', LEFT);
					break;
				case 38:
					this.fire('rotate', RIGHT);
					break;
				case 39:
					this.fire('move', RIGHT);
					break;
				case 40:
					this.fire('down');
					break;
				default:
					handled = false;
					break;
			}

			return !handled;
		},

		keyPress : function(event)
		{
			var handled = true;
			if (this.gameOver) return true;

			keyChar = event.key;

			switch(keyChar)
			{
				case ' ':
					this.fire('harddown');
					break;
				case 'a':
					this.fire('move', LEFT);
					break;
				case 'd':
					this.fire('move', RIGHT);
					break;
				case 's':
					this.fire('down');
					break;
				case 'z':
				case 'e':
					this.fire('rotate', LEFT);
					break;
				case 'q':
				case 'x':
					this.fire('rotate', RIGHT);
					break;
				case 'c':
					this.fire('hold', LEFT);
					break;
				default:
					handled = false;
					break;
			}

			return !handled;
		},

		holdSelect : function()
		{
//			this.game.hold();
		},

		onPlay : function()
		{
			console.log('PLAY GAME!!!!');
			this.fire('new-game');
		},
	})
});
