var StarWarsQuiz = require('../build/js/star-wars-quiz.js');

describe('Application tests', function() {
    var starQuiz;

    beforeEach(function() {
        starQuiz= new StarWarsQuiz(120);
    });

    describe('Player scoring tests', function() {
        it('should to return the player score', function() {
            expect(0).toEqual(starQuiz.getPlayerScore())
        });
    });
})