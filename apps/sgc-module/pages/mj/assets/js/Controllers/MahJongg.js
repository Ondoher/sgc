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
			SAPPHIRE.application.listenPageEvent('firstShow', 'mj', this.onFirstShow.bind(this));
			SAPPHIRE.application.listenPageEvent('hide', 'mj', this.onHide.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'mj', this.onShow.bind(this));
		},

		onLoad : function(root)
		{
			this.game = new Sparcade.Engines.MahJongg();
			this.game.setSetup(undefined);
			this.view = new Sparcade.Views.MahJongg(root);

			this.view.listen('hint', this.onHint.bind(this));
			this.view.listen('undo', this.onUndo.bind(this));
			this.view.listen('redo', this.onRedo.bind(this));
			this.view.listen('new', this.onNew.bind(this));
			this.view.listen('selectBoard', this.onSelectBoard.bind(this));
			this.view.listen('select', this.onSelect.bind(this));
			this.view.listen('solve', this.onSolve.bind(this));
			this.view.listen('share', this.onShare.bind(this));

			this.onTimerTick.periodical(250, this);
		},

		onFirstShow : function(id)
		{
			console.log(id);
			this.newBoard(-1);
		},

		onShow : function(id)
		{
			console.log(id);
			if (id) id = JSON.parse(id);
			this.restartTimer();
			if (id && id.gameNbr) this.newBoard(id.gameNbr);
			if (id && id.time) this.view.toBeat(id.time);
		},

		onHide : function()
		{
			console.log('hidden');
			this.pauseTimer();
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
			if (!this.timerRunning) return;
			var time = new Date().getTime() - this.startTime;
			this.time = time;
			this.view.drawTime(time);
			this.timerRunning = false;
		},

		pauseTimer : function()
		{
			this.stopTime = new Date().getTime();
			this.timerRunning = false;
			this.paused = true;
		},

		onTimerTick : function()
		{
			if (!this.timerRunning) return;
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
				this.view.won();
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

		drawBoard : function()
		{
			this.view.clearBoard();
			var boardLayout = this.game.startBoard.pieces;

			for (var i = 0; i < boardLayout.length ; i++)
			{
				var x = boardLayout[i].pos.x;
				var y = boardLayout[i].pos.y;
				var z = boardLayout[i].pos.z;
				var face = boardLayout[i].face;

				this.addTile(i, x, y, z, face);
			}

			this.setState();
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
		},

		onSolve : function() {
			this.game.startOver();
			this.drawBoard();
			var solution = this.game.solution.clone();
			this.startTime = new Date().getTime() - 124000

			var int = setInterval(function()
			{
				var tile1, tile2;
				if (solution.length <= 2)
				{
					clearInterval(int)
					this.game.calcValidMoves();
					this.setState();
				}
				else
				{
					tile1 = solution.shift();
					tile2 = solution.shift();
					this.game.playPair(tile1, tile2);
					this.view.showTile(tile1, false)
					this.view.showTile(tile2, false)
				}
			}.bind(this), 50)
		},

		onShare : function()
		{
			console.log('sharing', this.game.gameNbr, this.time);
			SAPPHIRE.application.fire('share', this.game.gameNbr, this.time);
		},
	})
});

SAPPHIRE.application.registerController('mj', new Sparcade.Controllers.MahJongg());


