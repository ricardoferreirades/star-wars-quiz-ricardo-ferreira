'use strict';

(function(){

    var ranking = [];
    var pages = [];
    var API_url = 'https://swapi.co/api/';
    var cx = '012986508515575814453:vj14hgsjwcw';
    var gurl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBQ1fsoxnEgnE6nFUiy5g4LyYtOG5x1eVE&cx='+ 
        cx +'&searchType=image&imgColorType=color&imgSize=medium&imgType=face';
    var before = null;
    var next = null;
    var itemstoload = 9;

    // checking support
    if (typeof(Storage) !== "undefined") {
        var r = localStorage.getItem('ranking');

        if(!r) {
            localStorage.setItem('ranking', JSON.stringify(ranking));
        } else {
            ranking = JSON.parse(r);
        }
    }

    function setranking (item, callback) {
        ranking.push(item);
        callback();
    }

    var characters = [];

    // application class
    function Application() {
            this.btnGame             = document.createElement('button'),
            this.gameArea            = document.createElement('div'),
            this.containerGameArea   = document.querySelector('.game'),
            this.quizContainer       = document.querySelector('.third'),
            this.btnPlay,
            this.content             = document.querySelector('.content');
            this.gameTime;
            this.halfgroup = [];
    }

    // create the game area
    Application.prototype.createGameArea = function (callback) {
        var t = this;
        this.btnPlay = this.btnGame.cloneNode(true);
        var loader = '<div class="lds-ripple"><div></div><div></div></div>';
        this.btnPlay.dataset.action  = 'playgame';
        this.btnPlay.textContent     = 'Play';
        this.btnHomeGroup = document.createElement('div');
        this.btnHomeGroup.classList.add('btn-home-group');
    
        this.gameArea.innerHTML = loader;
        this.gameArea.classList.add('game-area');
        this.containerGameArea.appendChild(this.gameArea);

        this.getGameItems(function() {
            // events 
            var ld = document.querySelector('.lds-ripple');
            ld.classList.add('hide');
            t.createRanking();
            t.btnPlay.onclick = t.play(t);
            t.btnHomeGroup.appendChild(t.btnPlay);
            t.gameArea.appendChild(t.btnHomeGroup);
        });
    };

    // start the quiz game
    Application.prototype.newGame = function(callback) {
            this.quizArea   = document.createElement('div');

        var paginationArea  = this.quizArea.cloneNode(true),
            btnBefore       = this.btnGame.cloneNode(true);

            this.loader2 = '<div class="lds-facebook"><div></div><div></div><div></div></div>';

            this.imagesArea = this.quizArea.cloneNode(true);

            this.btnAfter   = this.btnGame.cloneNode(true);
        
            this.game       = new StarWarsQuiz(120);
            this.gameTime   = this.game.getGameTime();
            var t = this;
            
            // adding classes
            this.quizArea.classList.add('quiz-area');
            this.imagesArea.classList.add('quiz-area__images-area');
            paginationArea.classList.add('quiz-area__pagination-area');
            
            // adding button's text
            btnBefore.textContent = 'Anterior';
            this.btnAfter.textContent = 'Carregar mais';
            
            // appending items to create the game area
            // paginationArea.appendChild(btnBefore);
            paginationArea.appendChild(this.btnAfter);
            this.quizArea.appendChild(this.imagesArea);
            this.quizArea.appendChild(paginationArea);
            this.quizContainer.appendChild(this.quizArea);

            this.addItems(pages);

            // btnBefore.onclick = this.getPreviousPage(t, function(e) {
            //     t.addItems(e);
            // });
            this.btnAfter.onclick = this.getNextPage(t, function(e) {
                t.btnAfter.innerHTML = 'Carregar mais';
                t.btnAfter.classList.remove('disabled');
                t.loadImages();
                t.addItems(e);
                t.btnAfter.disabled = false;
            });

            callback();

    }

    Application.prototype.getNextPage = function(t, callback) {
    
        return function (e) {
            this.classList.add('disabled');
            this.innerHTML = t.loader2;
            this.disabled = true;
            var xhr = new XMLHttpRequest();

            var tt = this;

            xhr.open('get', next, true);
            xhr.responseType = 'json';
            
            xhr.onloadend = function(e) {
                var response = xhr.response;
                if (response) {
                    pages = [];
                    before = response.before;
                    next = response.next;

                    if(!next) {
                        tt.remove();
                        return false;
                    }

                    pages.push(response.results);
                    response.results.forEach(function(elm) {
                        characters.push(elm);
                    });
                    callback(pages);
                } else {
                    this.disabled = true;
                }

            }

            xhr.send()
        }
    }

    Application.prototype.getPreviousPage = function(t, callback) {
        var t = this;
        return function () {
            // return somthing
        }
    }

    // show the game area after component is ready
    Application.prototype.play = function () {
        var t = this;
        return function(e) {
            t.newGame(function() {
                t.content.classList.add('is__playing');
                t.countStart();
            });
        }
    }

    //add images to quess
    //receive an array of items
    Application.prototype.addItems = function (pages) {
        var t = this;
        var pg = document.createElement('div');
        pg.classList.add('page');

        pages = pages.sort(function(a, b){return 0.5 - Math.random()});

        pages.forEach(function(items) {
            
            items.forEach(function (item, i) {
                var quizItem    = document.createElement('div'),
                    actionArea  = quizItem.cloneNode(true),
                    form       = document.createElement('form'),
                    image       = document.createElement('img'),
                    inputAnswer = document.createElement('input'),
                    btnTips     = document.createElement('div'),
                    wrapper     = btnTips.cloneNode(true),
                    btnAnswer   = t.btnGame.cloneNode(true);
    
                btnTips.textContent = "?";
                btnTips.dataset.ref = 'r' + i;
                btnTips.dataset.index = i;
                btnAnswer.textContent = "Ok";
                btnAnswer.type = "submit";
                inputAnswer.name = 'name';
                inputAnswer.type = 'text';
                inputAnswer.dataset.index= i;
                inputAnswer.placeholder = 'Resposta';
                image.src = item.link;
                form.dataset.ref = 'r' + i;
                quizItem.classList.add('quiz-area__quiz-item');
                wrapper.classList.add('quiz-area__quiz-item-wrapper');
    
                quizItem.appendChild(image);
                form.appendChild(inputAnswer);
                form.appendChild(btnAnswer);
                form.appendChild(btnTips);
                actionArea.appendChild(form);
                quizItem.appendChild(actionArea);
                wrapper.appendChild(quizItem);
    
                pg.appendChild(wrapper);

                t.imagesArea.appendChild(pg);
    
                form.onsubmit = t.validateAnswer(t);
                btnTips.onclick = t.showDetails(t);
            }); // end items
        }); // end pages
        
    }

    Application.prototype.validateAnswer = function() {
        var t = this;
        return function (e) {
            e.preventDefault();
            var target  = e.target, 
                elms    = target.elements,
                ref     = target.dataset.ref,
                hg      = t.halfgroup.join(','),
                reg     = new RegExp(ref),
                isHalf  = reg.test(hg);

            // player answer
            var pAnswer = elms['name'];
            // server answer
            var cAnswer = characters[parseInt(pAnswer.dataset.index)];

            // avoiding hack value
            if (!ref || ref === '') return false;

            if(pAnswer.value !== '') {
                // return true if the answer is correct
                if (t.game.checkAnswer(cAnswer.name, pAnswer.value)) {
                    if (isHalf) {
                        t.game.setPlayerScore('half');
                    } else {
                        t.game.setPlayerScore();
                    }
                }
    
                this.remove();
            }


        }
    }

    Application.prototype.showDetails = function() {
        var t = this;
        return function(e) {
            var target  = e.target;
            var ref     = target.dataset.ref;
            var idx     = target.dataset.index;
            
            // return the character to substract the score
            var hasRef = t.halfgroup.filter(function(elm) {
                return elm === ref
            });

            // checking if the character is in the group
            // to substract the score
            if(!hasRef.length) {
                t.halfgroup.push(ref);
            }

            // checking if the modal area exist
            if(!t.modalArea) {
                t.modal();
            }

            // avoiding replace the same content
            if (t.modalContent.dataset.ref === ref) {
                t.modalArea.classList.add('open');
                return false
            };

            var details, title, personal, films, vehicles;
            
            title = '<h3 class="modal__title">Detalhes do personagem</h3>';

            details = characters[idx];
            
            personal = '<table>' +
            '<tr><td>Gênero:</td><td>' + details.gender + '</td></tr>' +
            '<tr><td>Altura:</td><td>' + (details.height/100) + 'm</td></tr>' +
            '<tr><td>Cabelo:</td><td>' + details.hair + '</td></tr>' +
            '<tr><td>Cor do cabelo:</td><td>' + details.hair_color + '</td></tr>' +
            '<tr><td>Cor da pele:</td><td>' + details.skin_color + '</td></tr>' +
            '<tr><td>Cor dos olhos:</td><td>' + details.eye_color + '</td></tr>' +
            '<tr><td>Qtd Filmes:</td><td>' + details.films.length + '</td></tr>' +
            '<tr><td>Qtd vehicles:</td><td>' + details.vehicles.length + '</td></tr>' +
            '</table>';
            
            // films       = '<div><p>Filmes: '+ details.films.join(', ') +'</p></div>';
            // vehicles    = '<div><p>Veículos: '+ details.vehicles.join(', ') +'</p></div>';

            t.modalContent.innerHTML    = title + personal;
            t.modalContent.dataset.ref  = ref;
            t.modalArea.classList.add('open');
        }
    }

    // start the countdown
    Application.prototype.countStart = function() {
        var timer = document.createElement('div'),
            m = parseInt(this.gameTime / 60),
            s = parseInt(this.gameTime % 60),
            t = this;

            timer.classList.add('timer')

            this.quizArea.prepend(timer);

            function setTime(e) {
                timer.innerHTML = e;
            }

            var intervalo = setInterval(function() {

                if(s===0 && m > 0) {
                    s = 59;
                    setTime(('0' + --m + ':' + s--) );
                } else if (s > 0) {
                    setTime(s > 9 ? ('0' + m + ':' + s--) : ('0' + m + ':0' + s--) );
                } else {
                    setTime('00:00');
                    clearInterval(intervalo);
                    t.quizArea.innerHTML = '';
                    t.showResult();
                }
                    
            }, 1000);
    }

    // show result when game is finished
    Application.prototype.showResult = function () {
        var t = this;
        pages = [];

        var ld = document.querySelector('.lds-ripple');
        ld.classList.remove('hide');
        t.btnHomeGroup.classList.add('hide');
        
        this.getGameItems(function() {
            
            setTimeout(function() {
                ld.classList.add('hide');
                t.btnHomeGroup.classList.remove('hide');
            }, 3000);

        });

        var resultArea  = document.createElement('div'),
            title       = document.createElement('h3'),
            totalScore  = document.createElement('div'),
            close       = this.btnGame.cloneNode(true),
            save        = this.btnGame.cloneNode(true),
            form        = document.createElement('form'),
            inpName     = document.createElement('input'),
            inpEmail    = inpName.cloneNode(true),
            t = this;

            if(!this.modalArea) {
                this.modal();
            }

        t.modalArea.classList.remove('open');

        totalScore.classList.add('score');
        totalScore.textContent = this.game.getPlayerScore() + ' pontos';
        title.textContent = "Fim do jogo";
        close.textContent = 'x';
        close.classList.add('close');
        save.textContent = 'Salvar';
        save.type = 'submit';
        inpName.name = 'name';
        inpName.type = 'text';
        inpName.placeholder = 'Seu nome';
        inpEmail.name = 'email';
        inpEmail.type = 'text';
        inpEmail.required = true;
        inpEmail.placeholder = 'exemplo@email.com';

        resultArea.appendChild(close);
        resultArea.appendChild(title);
        resultArea.appendChild(totalScore);
        form.appendChild(inpName);
        form.appendChild(inpEmail);
        form.appendChild(save);
        resultArea.classList.add('result-area');

        resultArea.appendChild(form);
        
        this.quizArea.appendChild(resultArea);

        close.onclick   = this.resetGame(this);
        form.onsubmit    = this.saveResult(this);
    }

    Application.prototype.resetGame = function() {
        var t = this;
        return function() {
            t.content.classList.remove('is__playing');
            t.quizArea.remove();
        }
    }

    Application.prototype.saveResult = function(e) {
        var t = this;
        return function(e) {
            e.preventDefault();
            var elm = e.target.elements;
            
            if (elm['name'].value === '') return;
            
            var playerData = {
                name: elm['name'].value,
                email: elm['email'].value || 'email não informado',
                score: t.game.getPlayerScore()
            };
            
            localStorage.removeItem('ranking');

            setranking(playerData, function() {
                localStorage.setItem('ranking', JSON.stringify(ranking));
            })

            t.createRanking();
            t.content.classList.remove('is__playing');
            t.quizArea.remove();
            
        }
    }

    Application.prototype.createRanking = function() {
        if(ranking.length && !this.btnRanking) {
            this.btnRanking = this.btnGame.cloneNode(true);
            this.btnRanking.textContent = 'Ranking';
            this.btnHomeGroup.appendChild(this.btnRanking);
            this.gameArea.appendChild(this.btnHomeGroup);
            this.btnRanking.onclick = this.showRanking(this);
        }
    }

    Application.prototype.showRanking = function() {
        var t = this;

        return function() {

            if (!t.modalArea) {
                t.modal();
            }

            var title = '<h3 class="modal__title">';
            
            t.modalContent.innerHTML = '';
            title += 'Ranking</h3>';
            t.modalContent.innerHTML = title;

            var tb = document.createElement('table');
            tb.classList.add('ranking');
            var tbcontent = '<tr><td>Nome</td><td>E-mail</td><td>Pontos</td>';


            function compare(a,b) {
                if (a.score > b.score)
                  return -1;
                if (a.score < b.score)
                  return 1;
                return 0;
              }
              

              function reorder(arr, callback) {
                  var r = ranking.sort(compare);
                  callback(r);
              }

              reorder(ranking, function(items) {

                  items.forEach(function(item) {
                    tbcontent += '<tr><td>' + item.name + '</td><td>' + item.email + '</td><td class="score">' + item.score + '</td></tr>';
                  });
                  
                  tb.innerHTML = tbcontent;
                  t.modalContent.appendChild(tb);
                  t.modalArea.classList.add('open');
              });

        }
    }

    Application.prototype.modal = function() {
        this.modalArea;
        if(!this.modalArea) {
            this.modalArea      = document.createElement('div');
            this.modalContainer = this.modalArea.cloneNode(true);
            this.modalContent   = this.modalArea.cloneNode(true);
            var close           = document.createElement('button');

            this.modalArea.classList.add('modal');
            this.modalContainer.classList.add('modal__container');
            this.modalContent.classList.add('modal__content');
            close.classList.add('modal__close');
            close.textContent = 'x';

            this.modalContainer.appendChild(close);
            this.modalContainer.appendChild(this.modalContent);
            this.modalArea.appendChild(this.modalContainer);
            document.body.prepend(this.modalArea);

            close.onclick = this.closeModal(this);
        }
    }

    Application.prototype.closeModal = function() {
        var t = this;
        return function () {
            t.modalArea.classList.remove('open');
        }
    }
    
    Application.prototype.getGameItems = function(callback) {
     var t = this;
        var xhr = new XMLHttpRequest();

        xhr.open('get', API_url + 'people', true);
        xhr.responseType = 'json';
        
        xhr.onloadend = function(e) {
            var response = xhr.response;
            before = response.previous;
            next = response.next;
            pages.push(response.results);
            response.results.forEach(function(elm) {
                characters.push(elm);
            });
            t.loadImages();
            callback();
        }

        xhr.send()
    }

    Application.prototype.loadImages = function() {

        var reference = 'https://starwars-visualguide.com/assets/img/characters/';

        characters.forEach(function(item, i) {
            if(i < 16) {
                item.link = reference + (i + 1) + '.jpg';
            } else {
                item.link = reference + (i + 2) + '.jpg';
            }
        });
    }

    // creating game area
    var start = new Application();
    start.createGameArea();
})()
