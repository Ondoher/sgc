// wordracer view


View = function() {
	this.aCode = new String('a').charCodeAt(0);
	this.gameOver = true;
}

//============================================================================
// Internal methods
//============================================================================

/**
 * plays the given sound.
 * @param string rSound a string that represents the sound to play. these are
 *	   assigned in loadSound.
 * @param boolean rLoop true to loop the sound, false to play once
 */
View.prototype.playSound = function(rSound, rLoop) {
	if (!FRAMEWORK.isShell) return;

	playSound(rSound, rLoop, null);
};

//----------------------------------------------------------------------------
/**
 * hides and shows the start and enter buttons based on game state
 */
View.prototype.drawButtonState = function() {
	this.enterButton.style.visibility = (this.gameOver)?'hidden':'inherit';
	this.startButton.style.visibility = (!this.gameOver)?'hidden':'inherit';
};



/**
 * draws the played letters
 */
View.prototype.drawPlayed = function() {
	var vPlayed = MODEL.getPlayedLetters();

	// first, get the letters that are in the word
	for (var vIdx = 0; vIdx < vPlayed.length; vIdx++)
	{
		this.playedLetters[vIdx].style.visibility = (this.gameOver)?'hidden':'inherit';
		this.playedLetters[vIdx].empty();
		this.playedLetters[vIdx].grab(this.letters[vPlayed[vIdx].charCodeAt(0) - this.aCode].cloneNode(false));
	}

	// now draw the unused letters as the blank
	for (var vIdx = vPlayed.length; vIdx < 6; vIdx++)
	{
		this.playedLetters[vIdx].style.visibility = (this.gameOver)?'hidden':'inherit';
		this.playedLetters[vIdx].empty();
		this.playedLetters[vIdx].grab(this.blank.cloneNode(false));
	}
};

//----------------------------------------------------------------------------
/**
 * draws the unplayed letters. played letters are left empty
 */
View.prototype.drawUnplayed = function() {
	var vUnplayed = MODEL.getAvailableLetters();

	for (var vIdx = 0; vIdx < 6; vIdx++)
	{
		this.unplayedLetters[vIdx].empty();
		this.unplayedLetters[vIdx].style.visibility = (this.gameOver)?'hidden':'inherit';
		if (vUnplayed[vIdx] != undefined)
			this.unplayedLetters[vIdx].grab(this.letters[vUnplayed[vIdx].charCodeAt(0) - this.aCode].cloneNode(false));
	}
};

/**
 * draws the word list. The word list if five columns of words, each with 15 rows.
 */
View.prototype.drawWords = function() {
	var vColumn = 0;
	var vRow = 0;
	var vText = '';

	// Loop through each word list by length
	for (vIdx = 3; vIdx <=6; vIdx++)
	{
		var vWords = MODEL.getWords(vIdx);
		for (var vWord = 0; vWord < vWords.length; vWord++)
		{
			// put a break between each word
			if (vText != '') vText += '<br />';
			// add hilite for unplayed words at game end
			if (this.gameOver && !MODEL.wordPlayed(vWords[vWord]))
				vText += '<span style="color:red;">' + vWords[vWord] + '</span>';
			else {
				if (MODEL.wordPlayed(vWords[vWord])) vText += vWords[vWord];
				else vText += this.getBlank(vIdx);
			}

			// end of row check. If full output the row into the column div and reset
			vRow++;
			if (vRow >= 13)
			{
				this.wordColumns[vColumn].empty();
				this.wordColumns[vColumn].innerHTML = vText;
				vRow = 0;
				vColumn++;
				vText = ''
			}
		}
	}

	// All words processed, dump the rest
	if (vText != '')
	{
		this.wordColumns[vColumn].empty();
		this.wordColumns[vColumn].innerHTML = vText;
		vColumn++;
	}

	for (var vIdx = vColumn; vIdx < 5; vIdx++)
	{
		this.wordColumns[vIdx].empty();
	}
};

View.prototype.drawScore = function() {
	this.scoreValue.innerHTML = MODEL.getScore();
};

//----------------------------------------------------------------------------
/**
 * draws the given time into the time value div
 * @param integer rTime time in milliseconds
 */

View.prototype.drawTime = function(rTime) {
	rTime = rTime / 1000;
	if (rTime < 0) rTime = 0;
	var vMinutes = Math.floor(rTime / 60);
	var vSeconds = Math.floor(rTime % 60);
	var vDisplay = '';

	if (vMinutes < 10) vDisplay += '0';
	vDisplay += vMinutes;
	vDisplay += ':';
	if (vSeconds < 10) vDisplay += '0';
	vDisplay += vSeconds;

	this.timerValue.empty();
	this.timerValue.innerHTML = vDisplay;
};


View.prototype.drawButtonState = function() {
	this.enterButton.style.visibility = (this.gameOver)?'hidden':'inherit';
	this.startButton.style.visibility = (!this.gameOver)?'hidden':'inherit';
};

//----------------------------------------------------------------------------
/**
 * gets a string for an unplayed word
 * @oaram integer rCount the number of letters in the blank word
 * @return blank word string
 */
View.prototype.getBlank = function(rCount) {
	var vResult = '';
	for (var vIdx = 0; vIdx < rCount; vIdx++)
		vResult += '-';

	return vResult;
};



//============================================================================
// Event handlers
//============================================================================

//----------------------------------------------------------------------------
/**
 * Attempt to play the current word
 */
View.prototype.playWord = function() {
	if (this.gameOver) return;
	if (MODEL.playWord())
	{
		this.playSound('click', false)
		this.drawPlayed();
		this.drawUnplayed();
		this.drawWords();
		this.drawScore();

		// check for no more words
		if (MODEL.isComplete()) {
			this.endGame(true);
		}
	} else
		this.playSound('badword', false)
};

//----------------------------------------------------------------------------
/**
 * unplays all letters abd scrambles the unplayed list
 */
View.prototype.scramble = function() {
	if (this.gameOver) return;
	MODEL.scramble();
	this.drawPlayed();
	this.drawUnplayed();
	this.playSound('click', false);
};

//----------------------------------------------------------------------------
/**
 * plays all the letters from the last played word
 */
View.prototype.restoreLastWord = function() {
	if (this.gameOver) return;
	MODEL.restoreLastWord();
	this.drawPlayed();
	this.drawUnplayed();
	this.playSound('click', false)
};

//----------------------------------------------------------------------------
/**
 * unplays all letters
 */
View.prototype.clear = function() {
	if (this.gameOver) return;
	this.playSound('click', false)
	MODEL.clear();
	this.drawPlayed();
	this.drawUnplayed();
};

//----------------------------------------------------------------------------
/**
 * process the end of game. Is also called by the game timer
 */
View.prototype.endGame = function(winner)
{
	if (this.gameOver) return;

	CONTROLLER.stopTimer();
	this.drawButtonState();
	this.drawPlayed();
	this.drawUnplayed();

	//submit score
	var highScore = MODEL.saveScore();

	// show final game msg
	// determine state
	FRAMEWORK.showPopup('alert');
	if (winner)
		if (highScore)
			vClass = 'winnerhighscore';
		else
			vClass = 'winner';
	else
		if (highScore)
			vClass = 'gameoverhighscore';
		else
			vClass = 'gameover';

	$('alert_img').className = vClass;
	$('alert_score').innerHTML = MODEL.getScore();
};


//----------------------------------------------------------------------------
/**
 * plays the letter at the given index
 * @param integer rIndex the location within the unplayed letter array
 */
View.prototype.playLetter = function(rIndex) {
	if (this.gameOver) return;
	MODEL.playLetter(rIndex);
	this.drawPlayed();
	this.drawUnplayed();
	this.playSound('slide', false)
};

//----------------------------------------------------------------------------
/**
 * unplays a letter at the given index into the played letter array. This letter will
 * go back into its original starting location
 * @param integer rIndex the location within the played letter array
 */
View.prototype.unplayLetter = function(rIndex) {
	if (this.gameOver) return;
	if (MODEL.unplayLetter(rIndex)) {
		this.drawPlayed();
		this.drawUnplayed();
		this.playSound('slide', false)
	}
};


// game data page - loads model with words
View.prototype.onDataLoad = function() {
	MODEL.init();
	CONTROLLER.init();
};

View.prototype.onMenuLoad = function() {
	assignClickHandler($("play"), delegate(CONTROLLER, CONTROLLER.onPlayClick));
	assignClickHandler($("scores"), delegate(CONTROLLER, CONTROLLER.onScoresClick));
	assignClickHandler($("help"), delegate(CONTROLLER, CONTROLLER.onHelpClick));
	stopScroll($("wordracer-menu"));
};

View.prototype.onPlayLoad = function() {
	this.load();

	this.getDOM();

	// nav buttons
	assignClickHandler($('homeButton'), delegate(CONTROLLER, CONTROLLER.onMenuClick));
	assignClickHandler($('helpButton'), delegate(CONTROLLER, CONTROLLER.onHelpClick));

	// game play buttons
	assignClickHandler($('startButton'), delegate(CONTROLLER, CONTROLLER.onStartClick));
	assignClickHandler($('enterButton'), delegate(CONTROLLER, CONTROLLER.onEnterClick));
	assignClickHandler($('scrambleButton'), delegate(CONTROLLER, CONTROLLER.onScrambleClick));
	assignClickHandler($('lastButton'), delegate(CONTROLLER, CONTROLLER.onLastClick));
	assignClickHandler($('clearButton'), delegate(CONTROLLER, CONTROLLER.onClearClick));
	assignClickHandler($('endButton'), delegate(CONTROLLER, CONTROLLER.onEndClick));
};

// game image page processing
View.prototype.onImageLoad = function() {
	this.preloadImageDone = FRAMEWORK.addPreload();
	this.letters = new Array(26);

	// load the letter images
	for (var vIdx = 0; vIdx < 26; vIdx++)
	{
		var vNode = $(String.fromCharCode(this.aCode + vIdx));
		this.letters[vIdx] = vNode.parentNode.removeChild(vNode);
	}

	var vNode = $('blank');
	this.blank = vNode.parentNode.removeChild(vNode);

	this.preloadImageDone();
};

View.prototype.onScoresLoad = function() {
	assignClickHandler($('scorePage_homeButton'), delegate(CONTROLLER, CONTROLLER.onMenuClick));
	assignClickHandler($('scorePage_helpButton'), delegate(CONTROLLER, CONTROLLER.onHelpClick));
};


View.prototype.onScoresShow = function() {
	var scores = MODEL.getScores();
	for (var i=0, len = scores.length; i < len; i++) {
//		  var text = scores[i]['date']+" - "+scores[i]['score'];
		var text = scores[i]['score'];
		$('score'+i).innerHTML = text;
		$('score'+i).style.visibility = 'inherit';
	}

	for (var i=scores.length; i < MAX_SCORES; i++) {
		$('score'+i).style.visibility = 'hidden';
	}
};

View.prototype.onHelpLoad = function() {
	trace('View:onHelpLoad');
	var helpContent = $('help_content').dispose();
	var helpContainer = getScrollingWindow($('help_container'));
	helpContainer.grab(helpContent);

	assignClickHandler($('helpPage_homeButton'), delegate(CONTROLLER, CONTROLLER.onMenuClick));
};

View.prototype.onAlertLoad = function() {
	trace('View:onAlertLoad');
	assignClickHandler($('alert_img'), delegate(FRAMEWORK, FRAMEWORK.hidePopup));
};


//----------------------------------------------------------------------------
/**
 * Grabs all the dom nodes we ever need and sets the event handlers
 */
View.prototype.getDOM = function() {
	this.playedLetters = new Array(6);
	this.unplayedLetters = new Array(6);

	for (vIdx = 0; vIdx < 6; vIdx++)
	{
		this.playedLetters[vIdx] = $('playedSpace' + vIdx);
		this.unplayedLetters[vIdx] = $('unplayedSpace' + vIdx);

		assignClickHandler(this.playedLetters[vIdx], delegateArg1(CONTROLLER, CONTROLLER.onUnplayLetterClick, vIdx));
		assignClickHandler(this.unplayedLetters[vIdx], delegateArg1(CONTROLLER, CONTROLLER.onPlayLetterClick, vIdx));
	}

	this.enterButton = $('enterButton');
	this.startButton = $('startButton');

	this.timerFrame = $('timerFrame');
	this.timerValue = $('timerValue');

	this.scoreFrame = $('scoreFrame');
	this.scoreValue = $('scoreValue');

	this.wordColumns = new Array(5);
	for (var vIdx = 0; vIdx < 5; vIdx++)
		this.wordColumns[vIdx] = $('words' + vIdx);

	this.drawButtonState();
};


/**
 *
 */
View.prototype.load = function() {
	// preload sound
	if (FRAMEWORK.isShell)
	{
		this.preloadSoundDone = FRAMEWORK.addPreload();
		this.loadSound()
	}
};

//----------------------------------------------------------------------------
/**
 * preload the sounds
 */
View.prototype.loadSound = function() {
	sounds = new Array();

	var vServer = FRAMEWORK.server;

	sounds.push(new soundObj("click", true, false, vServer + "wap/sounds/click.wav", vServer + "wap/sounds/click.mp3"));
	sounds.push(new soundObj("slide", true, false, vServer + "wap/sounds/slide.wav", vServer + "wap/sounds/slide.mp3"));
	sounds.push(new soundObj("badword", true, false, vServer + "wap/sounds/wordracer/badword.wav", vServer + "wap/sounds/wordracer/badword.mp3"));
	sounds.push(new soundObj("outoftime", true, false, vServer + "wap/sounds/wordracer/outoftime.wav", vServer + "wap/sounds/wordracer/outoftime.mp3"));
	setupSounds(sounds, delegate(this, this.onSoundsLoaded));
};


//============================================================================
// Callbacks
//============================================================================

//----------------------------------------------------------------------------
/**
 * called by shell when souonds have been loaded
 */
View.prototype.onSoundsLoaded = function(rResult) {
	this.preloadSoundDone();
};




var VIEW = new View();
