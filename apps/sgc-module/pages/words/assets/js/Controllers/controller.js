// wordracer controller

var TIMEOUT = 2 * 60 * 1000;

Controller = function() {
}


Controller.prototype.init = function() {
    registerForSystemBack(delegate(CONTROLLER, CONTROLLER.onSystemBackCallback));
}

//----------------------------------------------------------------------------
/**
 * start the game timer and record the end of game time
 */
Controller.prototype.startTimer = function() {
    this.startTime = new Date().getTime();
    this.timeoutTime = this.startTime + TIMEOUT;
    
    if (this.timerHdl) clearInterval(this.timerHdl);
    this.timerHdl = setInterval(delegate(this, this.onTimer), 250);
    
    this.stopTime = 0;
    VIEW.drawTime(this.timeoutTime - this.startTime);
    VIEW.gameOver = false;
};

//----------------------------------------------------------------------------
/**
 * stops the timer
 */
Controller.prototype.stopTimer = function() {
    VIEW.gameOver = true;
    this.stopTime = new Date().getTime();
    if (this.stopTime > this.timeoutTime) this.stopTime = this.timeoutTime;
    
    if (this.timerHdl) clearInterval(this.timerHdl);
    VIEW.drawTime(0);
    VIEW.drawWords();
};



// menu/nav handlers
Controller.prototype.onMenuClick = function () {
    FRAMEWORK.showPage('menu');
}

Controller.prototype.onPlayClick = function () {
    FRAMEWORK.showPage('game');
}

Controller.prototype.onScoresClick = function () {
    FRAMEWORK.showPage('scores');
}

Controller.prototype.onHelpClick = function () {
    FRAMEWORK.showPage('help');
}

// play handlers
Controller.prototype.onStartClick = function () {
    MODEL.newGame(delegate(CONTROLLER, CONTROLLER.onStarted), 6);
    VIEW.playSound('click', false)
}

Controller.prototype.onScrambleClick = function () {
    VIEW.scramble();
}

Controller.prototype.onLastClick = function () {
    VIEW.restoreLastWord();
}

Controller.prototype.onClearClick = function () {
    VIEW.clear();
}

Controller.prototype.onEndClick = function () {
    VIEW.playSound('click', false)
    VIEW.endGame();
};

Controller.prototype.onEnterClick = function () {
    VIEW.playWord();
};

Controller.prototype.onPlayLetterClick = function (rIndex) {
    VIEW.playLetter(rIndex);
};

Controller.prototype.onUnplayLetterClick = function (rIndex) {
    VIEW.unplayLetter(rIndex);
};

/**
 * called when a word has been loaded in thre engine
 */
Controller.prototype.onStarted = function()
{
    this.startTime = new Date().getTime();
    this.startTimer();
    this.onTimer();
    this.gameOver = false;
    
    VIEW.drawPlayed();
    VIEW.drawUnplayed();
    VIEW.drawWords();
    VIEW.drawScore();
    VIEW.drawButtonState();
};


//----------------------------------------------------------------------------
/**
 * Interval function to count down
 */
Controller.prototype.onTimer = function() {
    if (VIEW.gameOver) return;
    
    var vTime = new Date().getTime();
    
    if (vTime > this.timeoutTime) {
        VIEW.playSound('outoftime', false)
        VIEW.endGame();
    }
    VIEW.drawTime(this.timeoutTime - vTime);
};

/**
 * handle system back cmds
 */
Controller.prototype.onSystemBackCallback = function() {
    trace('onSystemBackCallback');
    if (FRAMEWORK.getCurrentPage() == 'menu')
        return false;
    
    FRAMEWORK.showPage('menu');
    return true;
}


var CONTROLLER = new Controller();