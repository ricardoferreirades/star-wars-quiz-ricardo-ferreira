var StarWarsQuiz = require('../build/js/star-wars-quiz.js');

describe('Star Wars Class Tests', function() {
    var starQuiz;

    beforeEach(function() {
        starQuiz= new StarWarsQuiz(120);
    });

    describe('Player scoring tests', function() {
        it('should to return the player score', function() {
            expect(0).toEqual(starQuiz.getPlayerScore())
        });

        it('should to set the player score to 0', function() {
            starQuiz.setPlayerScore('reset');
            expect(0).toEqual(starQuiz.getPlayerScore())
        });

        it('should to add 10 points after a right answer', function() {
            starQuiz.setPlayerScore();
            expect(10).toEqual(starQuiz.getPlayerScore());
        });

        it('should to add 5 points after a right answer and see the tips', function() {
            starQuiz.setPlayerScore('half')
            expect(5).toEqual(starQuiz.getPlayerScore());
        });
    });

    describe('General game tests', function() {
        it('should to check if the answer is right or not', function() {
            var correctAnswer = "Ricardo",
                playerAnswer = " ricardo ";

            expect(true).toBe(starQuiz.checkAnswer(correctAnswer, playerAnswer));
        });

        it('should to set the game time to 120 seconds', function() {
            expect(120).toEqual(starQuiz.getGameTime());
        });

        it('should to set the player name', function() {
            starQuiz.setPlayerName('Ricardo');
            expect(typeof 'b').toBe(typeof starQuiz.getPlayerName());
        });

        it('should to set the player email', function() {
            starQuiz.setPlayerEmail('ricardo@email.com');
            expect(typeof 'b').toBe(typeof starQuiz.getPlayerEmail());
        });
    });
})