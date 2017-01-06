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

Package('Sparcade.Controllers', {
	MahJongg : new Class({
		Extends : Sapphire.Controller,

		initialize : function(tilePath, tileImgs, tileSize, rayout)
		{
			this.parent();
			Math.randomize();

			this.tilePath = tilePath;
			this.tileImgs = tileImgs;
			this.tileSize = tileSize;

			SAPPHIRE.application.listenPageEvent('load', 'mj', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'mj', this.onShow.bind(this));
		},

		onLoad : function()
		{
			console.log('MjController', 'onLoad');

			this.game = new Sparcade.Engines.MahJongg();
			this.game.setSetup(undefined);
			this.view = new Sparcade.Views.MahJongg();

			this.view.listen('hint', this.onHint.bind(this));
			this.view.listen('undo', this.onUndo.bind(this));
			this.view.listen('redo', this.onRedo.bind(this));
			this.view.listen('new', this.onNew.bind(this));
			this.view.listen('selectBoard', this.onSelectBoard.bind(this));
			this.view.listen('select', this.onSelect.bind(this));

			this.onTimerTick.periodical(250, this);
		},

		onShow : function()
		{
			console.log('MjController', 'onShow');
			this.newBoard(-1);
		},

		restartTimer : function()
		{
			if (!this.paused) return;
			this.startTimer();
		},

		startTimer : function()
		{
			var now = new Date().getTime();
			if (this.paused)
				this.startTime += now - this.stopTime;
			else
				this.startTime = new Date().getTime();

			this.timerRunning = true;
			this.paused = false;
		},

		stopTimer : function()
		{
			this.stopTime = new Date().getTime();
			this.timerRunning = false;
			this.paused = false;
		},

		pauseTimer : function()
		{
			this.stopTime = new Date().getTime();
			this.timerRunning = false;
			this.paused = true;
		},

		onTimerTick : function()
		{
			var time = new Date().getTime() - this.startTime;
			this.view.drawTime(time);
		},

		getEventPrefix : function()
		{
			return "mahjongg";
		},

		logEvent : function(event)
		{
		},

		liveLog : function(rMessage)
		{
		},

		setState : function ()
		{

			if (!this.game.arePlayablePairs() && this.game.tileCount == 0)
			{
				this.stopTimer();
				this.logEvent('win');
				this.message('YOU WIN!!!');
				this.gameOver = true;
			}
			else if (!this.game.arePlayablePairs())
			{
				this.pauseTimer();
				this.logEvent("lose");
				this.gameBack == true;
				this.message('NO MORE MOVES, GAME OVER');

			}
			else this.message('');

			var canUndo = this.game.tileCount == 0 || !this.game.canUndo()
			var canRedo = this.game.tileCount == 0 || !this.game.canRedo();
			this.view.drawState(this.game.tileCount, canUndo, canRedo);
			this.shortMessage('');
		},

		showTile : function(tile, on)
		{
			console.log('showTile', tile, on)
			this.view.showTile(tile, on);
		},


		hintTile : function(tile, on)
		{
			this.view.hintTile(tile, on);
		},

		highlightTile : function(tile, on)
		{
			this.view.highlightTile(tile, on);
		},

		hideHints : function()
		{
			if (this.hint1 != -1) this.hintTile(this.hint1, false);
			if (this.hint2 != -1) this.hintTile(this.hint2, false);
		},

		showHints : function(hint1, hint2)
		{
			this.hint1 = hint1;
			this.hint2 = hint2;

			if (this.hint1 != -1) this.hintTile(this.hint1, true);
			if (this.hint2 != -1) this.hintTile(this.hint2, true);
		},

		undo : function()
		{
			var pieces = this.game.undo();

			if (pieces == undefined) return;

			this.game.calcValidMoves();

			this.showTile(pieces.piece1, true);
			this.highlightTile(pieces.piece1, false);
			this.showTile(pieces.piece2, true);
			this.highlightTile(pieces.piece2, false);

			if(this.isStart && this.gameBack)
			{
				this.startTimer = true;
				this.gameBack = false;
			}
			this.setState();
		},

		redo : function()
		{
			var pieces = this.game.redo();

			if (pieces == undefined) return;
			this.game.calcValidMoves();

			this.showTile(pieces.piece1, false);
			this.highlightTile(pieces.piece1, false);
			this.showTile(pieces.piece2, false);
			this.highlightTile(pieces.piece2, false);

			this.setState();
		},

		message : function(message)
		{
			this.view.message(message);
		},

		shortMessage : function(message)
		{
			this.view.shortMessage(message);
		},

		addTile : function(tile, x, y, z, face)
		{
			this.view.addTile(tile, x, y, z, face);
		},

		makeBoard : function(board)
		{
			this.logEvent("newboard");

		// remove the old layout and recreate it
			try
			{
				this.view.clearBoard();

				this.game.generateGame(board);
				this.game.calcValidMoves();
				var boardLayout = this.game.startBoard.pieces;

				this.selectedTile = -1;
				this.message('');

				for (var i = 0; i < boardLayout.length ; i++)
				{
					var x = boardLayout[i].pos.x;
					var y = boardLayout[i].pos.y;
					var z = boardLayout[i].pos.z;
					var face = boardLayout[i].face;

					this.addTile(i, x, y, z, face);
				}

				this.setState();
			}
			catch (err)
			{
//				console.log(err);
			}
		},

		newBoard : function(board)
		{
			if (board == -1)
				board = Math.random(0xFFFFF);

			console.log('MjController', 'newBoard', board);

			this.selectedtile = -1;
			this.hintIdx = -1;
			this.hint1 = -1;
			this.hint2 = -1;

			this.gameOver = false;
			this.isStart = false
			this.gameBack = false;

			Math.randomize(board);

			var reNum = new RegExp(/^[0-9]+$/);

			this.message("Loading new game ...");

			this.makeBoard(board);
			console.log('made board', board);

			this.isStart = false;
			this.gameOver = false;

			this.stopTimer();
			this.startTimer();
	},

		validMove : function(tile)
		{
			return this.game.goodMoves[tile];
		},

		onNew : function()
		{
			console.log('MjController', 'onNew');
			this.newBoard(-1);
		},

		onHint : function()
		{
			this.restartTimer();

			this.hideHints();
			this.hintIdx++;
			if (this.hintIdx == 0) this.game.calcPlayablePairs(this.selectedTile);
			this.shortMessage('');

			if (this.hintIdx >= this.game.pairCount)
			{
				this.hintIdx = -1;
				this.shortMessage('NO MORE HINTS');
			}
			else
				this.showHints(this.game.pairs[this.hintIdx].piece1, this.game.pairs[this.hintIdx].piece2);
		},

		onSelect : function(tile)
		{
			this.hideHints();
			this.hintIdx = -1;

			if (!this.validMove(tile)) return;

			var boardLayout = this.game.startBoard.pieces;
			if (this.selectedTile == -1)
			{
				this.highlightTile(tile, true);
				this.selectedTile = tile;
			}
			else if (this.selectedTile == tile)
			{
				this.highlightTile(this.selectedTile, false);
				this.selectedTile = -1;
			}
			else
			{
				if (this.game.matchPair(boardLayout[tile].face, boardLayout[this.selectedTile].face))
				{
					this.game.playPair(tile, this.selectedTile);
					this.game.calcValidMoves();
					this.showTile(tile, false);
					this.showTile(this.selectedTile, false);
					this.selectedTile = -1;
				}
				else
				{
					this.highlightTile(tile, true);
					this.highlightTile(this.selectedTile, false);
					this.selectedTile = tile;
				}

			}

			if(!this.isStart)
			{
				this.timer = true;
				this.isStart = true;
			}

			this.setState();
		},

		onSelectBoard : function(boardNbr)
		{
			this.newBoard(boardNumber);
		},

		onUndo : function()
		{
			this.undo();
		},

		onRedo : function()
		{
			this.redo();
		}
	})
});

SAPPHIRE.application.registerController('mj', new Sparcade.Controllers.MahJongg());


