var TIMEOUT = 2 * 60 * 1000;

Package('SgcModule.Controllers', {
	Words : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'words', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'words', this.onShow.bind(this));
		},

		onLoad : function(root)
		{
			this.game = new SgcModule.Engines.Words();
			this.game.init();

			this.view = new SgcModule.Views.Words(root, this.game);
			this.view.init();
			this.view.listen('start', this.onStartClick.bind(this));
			this.view.listen('enter', this.onEnterClick.bind(this));
			this.view.listen('scramble', this.onScrambleClick.bind(this));
			this.view.listen('last', this.onLastClick.bind(this));
			this.view.listen('clear', this.onClearClick.bind(this));
			this.view.listen('end', this.onClearClick.bind(this));
			this.view.listen('unplay-letter', this.onUnplayLetterClick.bind(this));
			this.view.listen('play-letter', this.onPlayLetterClick.bind(this));
			this.view.listen('stop-timer', this.stopTimer.bind(this));
		},

		onShow : function(panel, query)
		{
//			this.view.start();
			this.game.newGame(this.onStarted.bind(this), 6);
		},

		startTimer : function()
		{
			this.startTime = new Date().getTime();
			this.timeoutTime = this.startTime + TIMEOUT;

			if (this.timerHdl) clearInterval(this.timerHdl);
			this.timerHdl = setInterval(this.onTimer.bind(this), 250);

			this.stopTime = 0;
			this.view.drawTime(this.timeoutTime - this.startTime);
			this.view.gameOver = false;
		},

		//----------------------------------------------------------------------------
		/**
		 * stops the timer
		 */
		stopTimer : function()
		{
			this.view.gameOver = true;
			this.stopTime = new Date().getTime();
			if (this.stopTime > this.timeoutTime) this.stopTime = this.timeoutTime;

			if (this.timerHdl) clearInterval(this.timerHdl);
			this.view.drawTime(0);
			this.view.drawWords();
		},

		// play handlers
		onStartClick : function ()
		{
			this.game.newGame(this.onStarted.bind(this), 6);
		},

		onScrambleClick : function ()
		{
			this.view.scramble();
		},

		onLastClick : function ()
		{
			this.view.restoreLastWord();
		},

		onClearClick : function ()
		{
			this.view.clear();
		},

		onEndClick : function ()
		{
			this.view.endGame();
		},

		onEnterClick : function ()
		{
			this.view.playWord();
		},

		onPlayLetterClick : function (index)
		{
			this.view.playLetter(index);
		},

		onUnplayLetterClick : function (index)
		{
			this.view.unplayLetter(index);
		},

		/**
		 * called when a word has been loaded in the engine
		 */
		onStarted : function()
		{
			this.startTime = new Date().getTime();
			this.startTimer();
			this.onTimer();
			this.gameOver = false;

			this.view.drawPlayed();
			this.view.drawUnplayed();
			this.view.drawWords();
			this.view.drawScore();
			this.view.drawButtonState();
			this.view.newGame();
		},

		//----------------------------------------------------------------------------
		/**
		 * Interval function to count down
		 */
		onTimer : function() {
			if (this.view.gameOver) return;

			var vTime = new Date().getTime();

			if (vTime > this.timeoutTime)
			{
				this.view.endGame();
			}
			this.view.drawTime(this.timeoutTime - vTime);
		},
	})
});

SAPPHIRE.application.registerController('words', new SgcModule.Controllers.Words());
