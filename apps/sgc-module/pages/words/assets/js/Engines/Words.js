Package('SgcModule.Engines', {
	Words : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.word = '';
			this.gameOver = true;
			this.score= 0;

			this.playedLetters = new Array(6);
			this.unplayedLetters = new Array(6);
		},

		init: function() {

			var digest = SAPPHIRE.templates.get('words_digest').text();
			digest = digest.replace(/\n/g, '');
			var solutions = SAPPHIRE.templates.get('words_content').text();
			solutions = solutions.replace(/\n/g, '');

			this.addWords(digest, solutions);
		},

		addWords : function(digest, solutions)
		{
			this.digest = new String(digest);
			this.solutions = new String(solutions);
			this.gameLength = digest.length / 6;
		},


		newGame: function(callback, wordSize)
		{
			this.gameOver = false;
			this.startGameCallback = callback;
			this.wordSize = wordSize;
			this.score = 0;

			this.lastWord = null;

			this.getNewWord();
		},


		/**
		 * scrambles the available letters, unplays all letters
		 */
		scramble: function() {
			var start = this.letters.slice();
			var index;

			this.letters = new Array();
			while (start.length > 0)
			{
				index = this.random(start.length);
				this.letters.push(start[index]);
				start.splice(index, 1);
			}

			this.playedLetters= new Array();
			this.unplayedLetters= this.letters.slice();
		},

		/**
		 * get an array of the unplayed letters. This array is always the same size
		 * as the word length. used letters are in the array as undefined.
		 * @return array remaining letters.
		 */
		getAvailableLetters: function()
		{
			return this.unplayedLetters;
		},

		//----------------------------------------------------------------------------
		/**
		 * gets the list of played letters. This list will be as long as the word being
		 * played
		 * @return array of letters
		 */
		getPlayedLetters: function()
		{
			var word = this.getWordInPlay();
			return word.split('');
		},

		/**
		 * returns the currently constructed word
		 */
		getWordInPlay: function()
		{
			var word = '';

			for (var idx= 0; idx < this.playedLetters.length; idx++)
				word +=  this.letters[this.playedLetters[idx]];

			return word;
		},


		//----------------------------------------------------------------------------
		/**
		 * calculate the score of a single word
		 * @param string word the word to be scored
		 * @return the score
		 */
		calcScore: function(word)
		{
			var SCORING_TABLE = [1, 2, 4, 25];

			return SCORING_TABLE[word.length - 3];
		},


		/**
		 * Takes the current word and tries to play it
		 * @return true if the word was played, false is already played or not a word
		 */
		playWord: function()
		{
			var word = this.getWordInPlay();

		// check if it is already played or not a word
			if (this.playedWords.indexOf(word) !== -1) return false;
			if (this.allWords.indexOf(word) == -1) return false;

		// score the word
			this.score += this.calcScore(word);
			this.playedWords.push(word);

		// Save the last word state
			this.lastWord = word;

		// reset
			this.playedLetters = [];
			this.unplayedLetters = this.letters.slice();

			return true;
		},

		/*
		 * check for all words complete
		 */
		isComplete: function()
		{
			return this.playedWords.length === this.allWords.length;
		},

		//----------------------------------------------------------------------------
		/**
		 * play the letter at the given index
		 * @param integer index of the letter to play within the scrambled word
		 */
		playLetter: function(index)
		{
			if (this.playedLetters.indexOf(index) != -1) return false;
			this.playedLetters.push(index);
			this.unplayedLetters[index]= undefined;
			return true;
		},

		//----------------------------------------------------------------------------
		/**
		 * unplay letter
		 * restore a letter to ints original location
		 * @param integer rIndex the location within the played letters to remove
		 *
		 * return true if a letter actually unplayed
		 */
		unplayLetter: function(index)
		{
			var idx = this.playedLetters[index];

			if (idx === undefined)
				return false;

			this.playedLetters.splice(index, 1);
			this.unplayedLetters[idx] = this.letters[idx];

			return true;
		},

		// handlers
/*
		onMenuLoad: function() {
			assignClickHandler($("play"), delegate(CONTROLLER, CONTROLLER.onPlayClick));
			assignClickHandler($("scores"), delegate(CONTROLLER, CONTROLLER.onScoresClick));
			assignClickHandler($("help"), delegate(CONTROLLER, CONTROLLER.onHelpClick));
			stopScroll($("wordracer-menu"));
		}
*/

		/**
		 * get the current game score
		 * @return score
		 */
		getScore: function()
		{
			return this.score;
		},

		//----------------------------------------------------------------------------
		/**
		 * get the list of words of a given length in alphabetical order
		 * @param integer length
		 * return array of words of the givenlength
		 */
		getWords: function(length)
		{
			var result = [];

			for (var idx = 0; idx < this.allWords.length; idx++)
			{
				if (this.allWords[idx].length == length) result.push(this.allWords[idx]);
			}

			result.sort();
			return result;
		},

		//----------------------------------------------------------------------------
		/**
		 * check if a word has already been played
		 * @param string rWord
		 * @return true if the word has been played, false otherwise
		 */
		wordPlayed: function(word)
		{
			return this.playedWords.indexOf(word) !== -1;
		},


		//----------------------------------------------------------------------------
		/**
		 * restores the last word to its played state
		 */
		restoreLastWord: function()
		{
			if (this.lastWord == undefined) return;

			this.playedLetters = [];
			this.unplayedLetters = this.letters.slice();

			for (var idx= 0; idx < this.lastWord.length; idx++) {
				var j = this.unplayedLetters.indexOf(this.lastWord[idx],0);
				this.playedLetters.push(j);
				this.unplayedLetters[j] = undefined;
			}
		},

		//----------------------------------------------------------------------------
		/**
		 * unplays all letters
		 */
		clear: function()
		{
			this.playedLetters = [];
			this.unplayedLetters = this.letters.slice();
		},

		//============================================================================
		// Internal methods
		//============================================================================

		/**
		*/
		getNewWord : function()
		{
			var which = this.random(this.gameLength);
			var startStr = this.digest.substr(which * 6, 6);
			var start = parseInt(startStr, 16);
			if (which == this.gameLength)
				var stopStr = '' + this.gameLength
			else
				var stopStr = this.digest.substr((which + 1) * 6, 6);

			var stop = parseInt(stopStr, 16);

			var json = this.solutions.substr(start, stop - start);
			json = json.replace(/'/g, '"');
			var result = JSON.parse(json);

			this.word =  result.w;
			this.allWords = result.s;

		// check the number of words to be within our range
			if (this.allWords.length > 65)
			{
				this.getNewWord();
				return;
			}
			if (this.allWords.length < 10)
			{
				this.getNewWord();
				return;
			}

		// initialize the game state
			this.playedWords = [];

		// add the letters of the main word to the letters array and scramble them
			this.letters = [];

			for (var idx = 0; idx < this.word.length; idx++)
				this.letters.push(this.word.charAt(idx));

			this.scramble();

		// playedLetters is an array of integers, each integer being an index into the scambled letter array
			this.playedLetters = new Array();

		// unplayed letters is an array of letters that have not been played. It is as long as the letters array,
		// but played letters are undefined
			this.unplayedLetters = this.letters.slice();

		// game all ready
			this.startGameCallback();
		},

		random: function(rMax)
		{
			return Math.floor(Math.random() * rMax);
		},
	})
});

