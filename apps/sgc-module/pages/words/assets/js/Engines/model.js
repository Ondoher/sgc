// wordracer model

function trace(str) {
    if (typeof(console) != 'undefined' && typeof(console.log) != 'undefined') {
        console.log('wordracer: ' + str);
    }
}

var gTag = 'wordracer'; // used for storing scores
var MAX_SCORES = 5;

Model = function() {
    this.word = '';
    this.gameOver = true;
    this.score = 0;

    this.playedLetters = new Array(6);
    this.unplayedLetters = new Array(6);

    this.highScores = new Array();
};


Model.prototype.init = function() {
    trace("Model:init");
    var vDigest = $('words_digest').innerHTML;
    var vSolutions = $('words_content').innerHTML;
    $('words_digest').parentNode.removeChild($('words_digest'));
    $('words_content').parentNode.removeChild($('words_content'));
    this.addWords(vDigest, vSolutions);

    getTextBlob(gTag,delegate(this, this.onResumeData));
}


Model.prototype.addWords = function(rDigest, rSolutions)
{
    trace("Model:addWords");
    this.digest = new String(rDigest);
    this.solutions = new String(rSolutions);
    this.gameLength = rDigest.length / 6;
};


Model.prototype.newGame = function(rCallback,rWordSize) {
    trace("Model:newGame");
    this.gameOver = false;
    this.startGameCallback = rCallback;
    this.wordSize = rWordSize;
    this.score = 0;

    this.lastWord = null;
    
    this.getNewWord();
};


/**
 * scrambles the available letters, unplays all letters
 */
Model.prototype.scramble = function() {
    trace("Model:scramble");
    var vStart = this.letters.slice();
    var vIndex;

    this.letters = new Array();
    while (vStart.length > 0)
    {
        vIndex = this.random(vStart.length);
        this.letters.push(vStart[vIndex]);
        vStart.splice(vIndex, 1);
    }
    
    this.playedLetters = new Array();
    this.unplayedLetters = this.letters.slice();
};


/**
 * get an array of the unplayed letters. This array is always the same size 
 * as the word length. used letters are in the array as undefined.
 * @return array remaining letters. 
 */
Model.prototype.getAvailableLetters = function() {
    return this.unplayedLetters;
};

//----------------------------------------------------------------------------
/**
 * gets the list of played letters. This list will be as long as the word being 
 * played
 * @return array of letters
 */
Model.prototype.getPlayedLetters = function() {
    var vWord = this.getWordInPlay();
    var vResult = new Array();
    
    for (var vIdx = 0; vIdx < vWord.length; vIdx++)
        vResult.push(vWord.charAt(vIdx));
        
    return vResult;
};

/**
 * returns the currently constructed word
 */
Model.prototype.getWordInPlay = function() {
    var vWord = '';
    
    for (var vIdx = 0; vIdx < this.playedLetters.length; vIdx++)
        vWord =  vWord + this.letters[this.playedLetters[vIdx]];
        
    return vWord;
};


//----------------------------------------------------------------------------
/**
 * calculate the score of a single word
 * @param string rWord the word to be scored
 * @return the score
 */
Model.prototype.calcScore = function(rWord) {
    var SCORING_TABLE = [1, 2, 4, 25];
    
    return SCORING_TABLE[rWord.length - 3];
};


/**
 * Takes the current word and tries to play it
 * @return true if the word was played, false is already played or not a word
 */
Model.prototype.playWord = function() {
    var vWord = this.getWordInPlay();

    // check if it is already played or not a word
    if (this.playedWords.indexOf(vWord) != -1) return false;
    if (this.allWords.indexOf(vWord) == -1) return false;

    // score the word
    this.score += this.calcScore(vWord);
    this.playedWords.push(vWord);
    
    // Save the last word state
    this.lastWord = vWord;

    // reset
    this.playedLetters = new Array();
    this.unplayedLetters = this.letters.slice();
    
    return true;
};

/*
 * check for all words complete
 */
Model.prototype.isComplete = function() {
    if (this.playedWords.length == this.allWords.length)
        return true;
    
    return false;
};

//----------------------------------------------------------------------------
/**
 * play the letter at the given index
 * @param integer index of the letter to play within the scrambled word
 */
Model.prototype.playLetter = function(rIndex) {
    if (this.playedLetters.indexOf(rIndex) != -1) return false;
    this.playedLetters.push(rIndex);
    this.unplayedLetters[rIndex] = undefined;
    return true;
};

//----------------------------------------------------------------------------
/**
 * unplay letter
 * restore a letter to ints original location
 * @param integer rIndex the location within the played letters to remove
 * 
 * return true if a letter actually unplayed
 */
Model.prototype.unplayLetter = function(rIndex) {
    var vIndex = this.playedLetters[rIndex];
    if (vIndex == undefined)
        return false;
    
    this.playedLetters.splice(rIndex, 1);
    this.unplayedLetters[vIndex] = this.letters[vIndex];
    
    return true;
};



// handlers
Model.prototype.onMenuLoad = function() {
    assignClickHandler($("play"), delegate(CONTROLLER, CONTROLLER.onPlayClick));
    assignClickHandler($("scores"), delegate(CONTROLLER, CONTROLLER.onScoresClick));
    assignClickHandler($("help"), delegate(CONTROLLER, CONTROLLER.onHelpClick));
    stopScroll($("wordracer-menu"));
}



/**
 * get the current game score
 * @return score
 */
Model.prototype.getScore = function() {
    return this.score;
};

//----------------------------------------------------------------------------
/**
 * get the list of words of a given length in alphabetical order
 * @param integer length
 * return array of words of the givenlength
 */
Model.prototype.getWords = function(rLength) {
    var vResult = new Array()
    
    for (var vIdx = 0; vIdx < this.allWords.length; vIdx++)
    {
        if (this.allWords[vIdx].length == rLength) vResult.push(this.allWords[vIdx]);
    }
    
    vResult.sort();
    return vResult;
};

//----------------------------------------------------------------------------
/**
 * check if a word has already been played
 * @param string rWord
 * @return true if the word has been played, false otherwise
 */
Model.prototype.wordPlayed = function(rWord) {
    return this.playedWords.indexOf(rWord) != -1;
};


//----------------------------------------------------------------------------
/**
 * restores the last word to its played state
 */
Model.prototype.restoreLastWord = function() {
    if (this.lastWord == undefined) return;
    
    this.playedLetters = new Array();
    this.unplayedLetters = this.letters.slice();
    
    for (var vIdx = 0; vIdx < this.lastWord.length; vIdx++) {
        var j = this.unplayedLetters.indexOf(this.lastWord[vIdx],0);
        this.playedLetters.push(j);
        this.unplayedLetters[j] = undefined;
    }

};

//----------------------------------------------------------------------------
/**
 * unplays all letters
 */
Model.prototype.clear = function() {
    this.playedLetters = new Array();
    this.unplayedLetters = this.letters.slice();
};


// save score
// return true if new high score
Model.prototype.saveScore = function() {
    trace('Model:saveScore');

    if (this.score == 0)
        return false;
    
    // find top scores index where current is less
    var i = MAX_SCORES;
    while (i > 0 && (!this.highScores[i-1] || this.score > this.highScores[i-1]['score']))
        i--;
    
    if (i >= 0 && i < MAX_SCORES) {
        var temp = new Object();
        temp['score'] = this.score;
        temp['date'] = ''; // new Date().toLocaleDateString();
        this.highScores.splice(i,0,temp);
        this.highScores.length = Math.min(MAX_SCORES,this.highScores.length);
        saveTextBlob(gTag, JSON.encode(this.highScores));
        return true;
    }
    
    return false;
}

Model.prototype.getScores = function() {
    trace('Model:getScores');
    
    return this.highScores;
}

//============================================================================
// Internal methods
//============================================================================


/**
*/
Model.prototype.getNewWord = function() {
    var vWhich = this.random(this.gameLength);
    var vStartStr = this.digest.substr(vWhich * 6, 6);
    var vStart = parseInt(vStartStr, 16);
    if (vWhich == this.gameLength) 
        var vStopStr = '' + this.gameLength
    else
        var vStopStr = this.digest.substr((vWhich + 1) * 6, 6);
        
    var vStop = parseInt(vStopStr, 16);
        
    var vJSON = this.solutions.substr(vStart, vStop - vStart);
    this.onNewWord(vJSON, true);
};

/**
 * handles the completion of the ajax call to get the new word
 * @param string rResult the string returned from rest/api
 * @param integer rStatus the http status code
 */
Model.prototype.onNewWord = function(rResult, rStatus) {
    var vResult = JSON.decode(rResult);
    
    this.word = vResult.w;
    this.allWords = vResult.s;
    
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
    this.playedWords = new Array();
    
    // add the letters of the main word to the letters array and scramble them
    this.letters = new Array();
    for (var vIdx = 0; vIdx < this.word.length; vIdx++)
        this.letters.push(this.word.charAt(vIdx));
        
    this.scramble();
    
    // playedLetters is an array of integers, each integer being an index into the scambled letter array
    this.playedLetters = new Array();
    
    // unplayed letters is an array of letters that have not been played. It is as long as the letters array, 
    // but played letters are undefined
    this.unplayedLetters = this.letters.slice();
    
    // game all ready
    this.startGameCallback();
};


Model.prototype.onResumeData = function(resumeData,error) {
    trace('Model:onResumeData '+resumeData+',error='+error);
    if (resumeData)
        this.highScores = JSON.decode(resumeData);

    if (this.highScores == null || this.highScores.length == null)
        this.highScores = new Array();
};

Model.prototype.onShutdownEvent = function(param) {
    trace('Model:onShutdown '+param);
    return JSON.encode(this.highScores);
};

/**
 * Utility function to get a random integer. return value will be > 0 and < rMax
 * @param integer rMax
 */
Model.prototype.random = function(rMax)
{
    return Math.floor(Math.random() * rMax);
};




MODEL = new Model();
