Package('SgcModule.Views', {
	Words : new Class({
		Extends : Sapphire.View,

		initialize : function(root, model)
		{
			this.root = root;
			this.parent();
			this.model = model;

			this.aCode = new String('a').charCodeAt(0);
			this.gameOver = true;
		},

		/**
		 * hides and shows the start and enter buttons based on game state
		 */
		drawButtonState : function()
		{
		},

		/**
		 * draws the played letters
		 */
		drawPlayed : function() {
			var played = this.model.getPlayedLetters();

		// first, get the letters that are in the word
			for (var idx = 0; idx < played.length; idx++)
			{
//				this.playedLetters[idx].css('visibility', (this.gameOver)?'hidden':'inherit');
				this.playedLetters[idx].empty();
				this.playedLetters[idx].append(this.letters[played[idx].charCodeAt(0) - this.aCode].clone());
			}

		// now draw the unused letters as the blank
			for (idx = played.length; idx < 6; idx++)
			{
//				this.playedLetters[idx].css('visibility', (this.gameOver)?'hidden':'inherit');
				this.playedLetters[idx].empty();
				this.playedLetters[idx].append(this.blank.clone());
			}
		},

		//----------------------------------------------------------------------------
		/**
		 * draws the unplayed letters. played letters are left empty
		 */
		drawUnplayed : function() {
			var unplayed = this.model.getAvailableLetters();

			for (var idx = 0; idx < 6; idx++)
			{
				this.unplayedLetters[idx].empty();
//				this.unplayedLetters[idx].css('visibility', (this.gameOver)?'hidden':'inherit');
				if (unplayed[idx] !== undefined)
					this.unplayedLetters[idx].append(this.letters[unplayed[idx].charCodeAt(0) - this.aCode].clone());
			}
		},

		/**
		 * draws the word list. The word list if five columns of words, each with 15 rows.
		 */
		drawWords : function() {
			var column = 0;
			var row = 0;
			var text = '';

			// Loop through each word list by length
			for (var idx = 3; idx <= 6; idx++)
			{
				var words = this.model.getWords(idx);
				for (var word = 0; word < words.length; word++)
				{
					// put a break between each word
					if (text != '') text += '<br />';
					// add highlite for unplayed words at game end
					if (this.gameOver && !this.model.wordPlayed(words[word]))
						text += '<span style="color:red;">' + words[word] + '</span>';
					else {
						if (this.model.wordPlayed(words[word])) text += words[word];
						else text += this.getBlank(idx);
					}

					// end of row check. If full output the row into the column div and reset
					row++;
					if (row >= 13)
					{
						this.wordColumns[column].empty();
						this.wordColumns[column].html(text);
						row = 0;
						column++;
						text = ''
					}
				}
			}

		// All words processed, dump the rest
			if (text != '')
			{
				this.wordColumns[column].empty();
				this.wordColumns[column].html(text);
				column++;
			}

			for (idx = column; idx < 5; idx++)
			{
				this.wordColumns[idx].empty();
			}
		},

		drawScore : function()
		{
			this.scoreValue.html(this.model.getScore());
		},

		//----------------------------------------------------------------------------
		/**
		 * draws the given time into the time value div
		 * @param integer rTime time in milliseconds
		 */

		drawTime : function(time)
		{
			time = time / 1000;
			if (time < 0) time = 0;
			var minutes = Math.floor(time / 60);
			var seconds = Math.floor(time % 60);
			var display = '';

			if (minutes < 10) display += '0';
			display += minutes;
			display += ':';
			if (seconds < 10) display += '0';
			display += seconds;

			this.timerValue.empty();
			this.timerValue.html(display);
		},


		drawButtonState : function()
		{
//			this.enterButton.css('visibility', (this.gameOver)?'hidden':'inherit');
//			this.startButton.css('visibility', (!this.gameOver)?'hidden':'inherit')
		},

		//----------------------------------------------------------------------------
		/**
		 * gets a string for an unplayed word
		 * @oaram integer rCount the number of letters in the blank word
		 * @return blank word string
		 */
		getBlank : function(count)
		{
			var result = '';
			for (var idx = 0; idx < count; idx++)
				result += '-';

			return result;
		},

		//============================================================================
		// Event handlers
		//============================================================================

		//----------------------------------------------------------------------------
		/**
		 * Attempt to play the current word
		 */
		playWord : function()
		{
			if (this.gameOver) return;

			if (this.model.playWord())
			{
				this.drawPlayed();
				this.drawUnplayed();
				this.drawWords();
				this.drawScore();

				// check for no more words
				if (this.model.isComplete()) {
					this.endGame(true);
				}
			}
		},

		//----------------------------------------------------------------------------
		/**
		 * unplays all letters abd scrambles the unplayed list
		 */
		scramble : function() {
			if (this.gameOver) return;
			this.model.scramble();
			this.drawPlayed();
			this.drawUnplayed();
		},

		//----------------------------------------------------------------------------
		/**
		 * plays all the letters from the last played word
		 */
		restoreLastWord : function() {
			if (this.gameOver) return;
			this.model.restoreLastWord();
			this.drawPlayed();
			this.drawUnplayed();
		},

		//----------------------------------------------------------------------------
		/**
		 * unplays all letters
		 */
		clear : function() {
			if (this.gameOver) return;
			this.model.clear();
			this.drawPlayed();
			this.drawUnplayed();
		},

		newGame : function()
		{
			this.root.removeClass('over');
		},

		//----------------------------------------------------------------------------
		/**
		 * process the end of game. Is also called by the game timer
		 */
		endGame : function(winner)
		{
			if (this.gameOver) return;
			this.root.addClass('over');
			if (winner) this.root.addClass('won');
			else this.root.removeClass('won');

			var message = winner?'YOU WIN':'GAME OVER';


			this.fire('stop-timer');
			this.drawButtonState();
			this.drawPlayed();
			this.drawUnplayed();

			$('.words-over-message').html(message);
			$('.words-over-score').html(this.model.getScore());

			$('#alert_score').html();
		},


		//----------------------------------------------------------------------------
		/**
		 * plays the letter at the given index
		 * @param integer rIndex the location within the unplayed letter array
		 */
		playLetter : function(index)
		{
			if (this.gameOver) return;
			this.model.playLetter(index);
			this.drawPlayed();
			this.drawUnplayed();
		},

		//----------------------------------------------------------------------------
		/**
		 * unplays a letter at the given index into the played letter array. This letter will
		 * go back into its original starting location
		 * @param integer rIndex the location within the played letter array
		 */
		unplayLetter : function(index)
		{
			if (this.gameOver) return;
			if (this.model.unplayLetter(index))
			{
				this.drawPlayed();
				this.drawUnplayed();
			}
		},

		onMenuLoad : function()
		{
			$('#play').click(this.fire.bind(this, 'play'));
		},

		init : function()
		{
			this.getDOM();

		// game play buttons
			$('#startButton').click(this.fire.bind(this, 'start'));
			$('#enterButton').click(this.fire.bind(this, 'enter'));
			$('#scrambleButton').click(this.fire.bind(this, 'scramble'));
			$('#lastButton').click(this.fire.bind(this, 'last'));
			$('#clearButton').click(this.fire.bind(this, 'clear'));
			$('#endButton').click(this.fire.bind(this, 'end'));

			this.getLetters();
		},

		// game image page processing
		getLetters : function() {
			this.letters = new Array(26);

			// load the letter images
			for (var idx = 0; idx < 26; idx++)
			{
				var letter = String.fromCharCode(this.aCode + idx)
				this.letters[idx] = SAPPHIRE.templates.get(letter);
			}

			var vNode = $('blank');
			this.blank = SAPPHIRE.templates.get('blank');
		},

		/**
		 * Grabs all the dom nodes we ever need and sets the event handlers
		 */
		getDOM : function()
		{
			this.playedLetters = [];
			this.unplayedLetters = [];

			for (var idx = 0; idx < 6; idx++)
			{
				this.playedLetters.push($('#playedSpace' + idx));
				this.unplayedLetters.push($('#unplayedSpace' + idx));

				this.unplayedLetters[idx].click(this.fire.bind(this, 'play-letter', idx));
				this.playedLetters[idx].click(this.fire.bind(this, 'unplay-letter', idx));
			}

			this.enterButton = $('#enterButton');
			this.startButton = $('#startButton');

			this.timerFrame = $('#timerFrame');
			this.timerValue = $('#timerValue');

			this.scoreFrame = $('#scoreFrame');
			this.scoreValue = $('#scoreValue');

			this.wordColumns = [];
			for (var idx = 0; idx < 5; idx++)
				this.wordColumns.push($('#words' + idx));

			this.drawButtonState();
		},
	})
});
