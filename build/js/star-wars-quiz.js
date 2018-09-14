'use strict';

var mod = null;

if(!this.window) {
    mod = module;
}

function StarWarsQuiz(gameTime) {
    this.playerScore = 0;
    this.gameTime = gameTime;
}

StarWarsQuiz.prototype.getPlayerScore = function() {
    return this.playerScore;
}

StarWarsQuiz.prototype.setPlayerScore = function() {
    if(arguments[0] === 'half') {
        this.playerScore += 5;
    } else if (arguments[0] === 'reset') {
        this.playerScore = 0;
    } else {
        this.playerScore += 10;
    }
}

StarWarsQuiz.prototype.checkAnswer = function() {
    var arg1 = arguments[0],
        arg2 = arguments[1];

    arg1 = arg1.split(" ");
    arg2 = arg2.split(" ");

    arg1 = arg1.join("").toLowerCase();
    arg2 = arg2.join("").toLowerCase();

    return arg1 === arg2;
}

StarWarsQuiz.prototype.getGameTime = function () {
    return this.gameTime;
}

StarWarsQuiz.prototype.setPlayerName = function () {
    this.playerName = arguments[0];
}

StarWarsQuiz.prototype.getPlayerName = function () {
    return this.playerName;
}

StarWarsQuiz.prototype.setPlayerEmail = function () {
    this.playerEmail = arguments[0];
}

StarWarsQuiz.prototype.getPlayerEmail = function () {
    return this.playerEmail;
}

if (mod) {
    module.exports = StarWarsQuiz;
}