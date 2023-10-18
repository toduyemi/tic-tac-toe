function StartState() {
    (() => {

        const startState = {
            players: [],

            init: function () {
                this.cacheDom();
                this.domBody.textContent = '';
                this.createHtmlElements();
                this.createDom();
                this.bindEvents();
            },

            cacheDom: function () {
                this.domBody = document.body;
            },

            createHtmlElements: function () {
                this.startScreenDiv = document.createElement('div');
                this.headersDiv = document.createElement('div');

                this.vsCtr = document.createElement('h1');
                this.vsCtr.textContent = 'vs';


                this.playerOneCtr = document.createElement('div');
                this.playerOneTitle = document.createElement('h1');
                this.playerOneIcon = document.createElement('div');
                this.playerOneInput = document.createElement('input');

                this.playerTwoCtr = document.createElement('div');
                this.playerTwoTitle = document.createElement('h1');
                this.playerTwoIcon = document.createElement('div');
                this.playerTwoInput = document.createElement('input');

                this.playerOneTitle.textContent = 'player one';
                this.playerTwoTitle.textContent = 'player two';

                this.playerOneTitle.setAttribute('form', 'playerForm');
                this.playerTwoTitle.setAttribute('form', 'playerForm');

                this.startGameBtn = document.createElement('button');
                this.startGameBtn.textContent = 'Start Game';

                this.startScreenDiv.classList.add('startScreenCtr', 'state-1');
                this.headersDiv.classList.add('headersCtr', 'state-1');
                this.vsCtr.classList.add('vsCtr', 'state-1');
                this.playerOneCtr.classList.add('playerCardCtr', 'state-1');
                this.playerOneTitle.classList.add('playerCardTitle', 'state-1');
                this.playerOneIcon.classList.add('playerCardIcon', 'state-1');
                this.playerOneInput.classList.add('playerCardInput', 'state-1');
                this.playerTwoCtr.classList.add('playerCardCtr', 'state-1');
                this.playerTwoTitle.classList.add('playerCardTitle', 'state-1');
                this.playerTwoIcon.classList.add('playerCardIcon', 'state-1');
                this.playerTwoInput.classList.add('playerCardInput', 'state-1');

                this.playerOneInput.required = true;
                this.playerTwoInput.required = true;
            },

            createDom: function () {
                this.playerOneIcon.innerHTML = xToken;
                this.playerTwoIcon.innerHTML = oToken;

                this.playerTwoCtr.appendChild(this.playerTwoTitle);
                this.playerTwoCtr.appendChild(this.playerTwoIcon);
                this.playerTwoCtr.appendChild(this.playerTwoInput);

                this.playerOneCtr.appendChild(this.playerOneTitle);
                this.playerOneCtr.appendChild(this.playerOneIcon);
                this.playerOneCtr.appendChild(this.playerOneInput);

                this.headersDiv.appendChild(this.playerOneCtr);
                this.headersDiv.appendChild(this.vsCtr);
                this.headersDiv.appendChild(this.playerTwoCtr);

                this.startScreenDiv.appendChild(this.headersDiv);
                this.startScreenDiv.appendChild(this.startGameBtn);

                this.domBody.appendChild(this.startScreenDiv);
            },

            bindEvents: function () {
                this.startGameBtn.addEventListener('click', this.startGame.bind(this))
            },

            startGame: function () {
                if (this.playerOneInput.value && this.playerTwoInput.value) {
                    this.players.push(this.playerOneInput.value);
                    this.players.push(this.playerTwoInput.value);

                    GameState(this.players[0], this.players[1]);
                }
            }
        };

        startState.init();

    })();
};

function GameState(playerOneName, playerTwoName) {
    const gameState = {
        play: GameController(playerOneName, playerTwoName),

        cacheDom: function () {
            this.domBody = document.body;
        },

        newGameInit: function () {
            this.cacheDom();
            this.domBody.textContent = '';
            this.createHtmlElements();
            this.createDom();
            this.bindEvents();
            this.switchPlayerHandler();
        },

        createHtmlElements: function () {
            this.appDiv = document.createElement('div');
            this.gameBoardDiv = document.createElement('div');
            this.playerOneNameHead = document.createElement('h1');
            this.playerTwoNameHead = document.createElement('h1');

            this.playerOneIcon = document.createElement('div');
            this.playerTwoIcon = document.createElement('div');

            this.playerOneNameHead.textContent = playerOneName;
            this.playerTwoNameHead.textContent = playerTwoName;

            this.appDiv.classList.add('appCtr');
            this.gameBoardDiv.classList.add('board-container');
            this.createBoard();
        },

        createDom: function () {

            this.appDiv.appendChild(this.playerOneNameHead);
            this.appDiv.appendChild(this.gameBoardDiv);
            this.appDiv.appendChild(this.playerTwoNameHead);


            this.domBody.appendChild(this.appDiv)
        },

        createBoard: function () {
            for (let i = 0; i < 3; i++) {
                const gridRow = document.createElement('div');

                gridRow.classList.add('grid-row');
                this.gameBoardDiv.appendChild(gridRow);

                for (let j = 0; j < 3; j++) {
                    const gridSquare = document.createElement('div')
                    gridSquare.classList.add('grid-square');

                    gridSquare.setAttribute('data-index-x', `${i}`);
                    gridSquare.setAttribute('data-index-y', `${j}`);
                    gridRow.appendChild(gridSquare);
                }
            }
        },

        bindEvents: function () {
            const gameTileDivs = document.querySelectorAll('.grid-square');
            gameTileDivs.forEach(square => {
                square.addEventListener('click', this.boardClickHandler.bind(this), { once: true }); //extra insurance to prevent playing on same tile
            });
        },

        dropHTMLToken: function (target) {

            const svgContainer = document.createElement('div');

            svgContainer.innerHTML = this.play.getActivePlayer().htmlToken;

            target.appendChild(svgContainer);
        },

        boardClickHandler: function (e) {
            currentCol = +e.target.getAttribute('data-index-x');
            currentRow = +e.target.getAttribute('data-index-y');
            this.dropHTMLToken(e.target);
            const statusCheck = this.play.playRound(currentCol, currentRow);

            if (statusCheck == 1) {
                GameEndState('win', this.play.getActivePlayer().name, playerOneName, playerTwoName);
            }

            else if (statusCheck == 2) {
                GameEndState('tie', this.play.getActivePlayer().name, playerOneName, playerTwoName);
            }
            this.switchPlayerHandler();
        },

        switchPlayerHandler: function () {
            if (this.play.getActivePlayer().name == playerOneName) {
                this.playerOneNameHead.classList.add('activePlayer');
                this.playerTwoNameHead.classList.remove('activePlayer');
            }

            else {
                this.playerTwoNameHead.classList.add('activePlayer');
                this.playerOneNameHead.classList.remove('activePlayer');
            }
        }
    }
    gameState.newGameInit();

}

function GameEndState(status, winner, playerOne, playerTwo) {
    const gameEndState = {

        cacheDom: function () {
            this.domBody = document.body;
        },

        init: function () {
            this.cacheDom();
            this.domBody.textContent = '';
            this.createHtmlElements(status);
            this.createDom();
            this.bindEvents();
        },

        createHtmlElements: function (status) {
            this.appDiv = document.createElement('div');
            this.endDeclarationHeader = document.createElement('h1');
            this.btnCtrDiv = document.createElement('div');
            this.playAgainBtn = document.createElement('button');
            this.newPlayersBtn = document.createElement('button');

            this.appDiv.classList.add('appCtr', 'state-3');
            this.btnCtrDiv.classList.add('btnCtr');
            this.playAgainBtn.classList.add('state-3');
            this.newPlayersBtn.classList.add('state-3');

            if (status == 'win') {
                this.endDeclarationHeader.textContent = `${winner} reigns supreme!`;
            }

            else if (status == 'tie') {
                this.endDeclarationHeader.textContent = `Damn yall stalemated! Boo!`;
            }

            this.playAgainBtn.textContent = 'Play Again?';
            this.newPlayersBtn.textContent = 'New Players';
        },

        createDom: function () {

            this.btnCtrDiv.appendChild(this.playAgainBtn);
            this.btnCtrDiv.appendChild(this.newPlayersBtn);

            this.appDiv.appendChild(this.endDeclarationHeader);
            this.appDiv.appendChild(this.btnCtrDiv);

            this.domBody.appendChild(this.appDiv);
        },

        bindEvents: function () {
            this.playAgainBtn.addEventListener('click', () => {
                GameState(playerOne, playerTwo)
            });
            this.newPlayersBtn.addEventListener('click', StartState);
        }


    }
    gameEndState.init();
}

function Gameboard() {
    const gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    const rows = 3, col = 3;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < col; j++) {
            gameboard[i][j] = SquareObject();
        }
    }

    function SquareObject() {
        const square = {};
        square.value = null;
        square.tokenCheck = false;

        const addToken = token => {
            if (square.tokenCheck) {
                return null;
            }

            square.value = token;
            square.tokenCheck = true;
            return true;
        }

        const getValue = (prop) => {
            if (prop == 'value') {
                return square.value;
            }

            else if (prop == 'tokenCheck') {
                return square.tokenCheck;
            }
        }
        return { addToken, getValue };
    }

    const dropToken = (row, col, token) => {

        if (!gameboard[col][row].addToken(token)) {
            return null;
        }
        else {
            return true;
        }
    }

    const getBoard = (prop) => gameboard.map(row => row.map(square => square.getValue(prop)));

    return { getBoard, dropToken };
};

const xToken = `<svg fill="#000000" height="230px" width="230px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 460.775 460.775" xml:space="preserve">
            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/> </svg>`;

const oToken = `<svg xmlns="http://www.w3.org/2000/svg" height="260px" viewBox="0 0 448 512"><style>svg{fill:#000000}</style><path d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z" /></svg>`;

function Player(name, token, htmlToken) {
    const player = {};
    player.name = name;
    player.token = token;
    player.htmlToken = htmlToken;

    return player;

}


function GameController(playerOneName, playerTwoName) {
    let PlayerOne = Player(playerOneName, 1, xToken);
    let PlayerTwo = Player(playerTwoName, 2, oToken);

    let activePlayer = PlayerOne;

    const game = Gameboard();
    printNewRound();

    const switchPlayer = () => {
        activePlayer = (activePlayer !== PlayerOne) ? PlayerOne : PlayerTwo;
    }

    function getActivePlayer() { return activePlayer };

    function printNewRound() {
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (col, row) => {

        // only switch player or check win if it doesn't return null, preventing player from placing on an invalid spot
        if (game.dropToken(row, col, getActivePlayer().token)) {
            console.log(`Dropping ${getActivePlayer().token} onto square ${col}, ${row}.`)

            //win logic here that returns toggle to go to game end screen if necessary
            if (checkWin(getActivePlayer().token)) {
                console.log(`${getActivePlayer().name} WINS!`);
                return 1;
            }

            else if (checkTie()) {
                console.log('check hcekc')
                return 2;
            }

            else {
                switchPlayer();
                printNewRound();
            }
        }

    }

    const checkWin = (token) => {

        const currentBoard = game.getBoard('value');
        for (let i = 0; i < 3; i++) {

            if ((currentBoard[i][0] == token) &&
                (currentBoard[i][1] == token) &&
                (currentBoard[i][2] == token)) {
                return true;
            }

            if ((currentBoard[0][i] == token) &&
                (currentBoard[1][i] == token) &&
                (currentBoard[2][i] == token)) {
                return true;
            }
        }

        if ((currentBoard[0][0] == token) &&
            (currentBoard[1][1] == token) &&
            (currentBoard[2][2] == token)) {
            return true;
        }

        if ((currentBoard[2][0] == token) &&
            (currentBoard[1][1] == token) &&
            (currentBoard[0][2] == token)) {
            return true;
        }

        return false;
    }

    function checkTie() {
        const currentBoard = game.getBoard('tokenCheck');

        const rows = 3, col = 3;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < col; j++) {

                if (!currentBoard[i][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    return {
        playRound: playRound,
        getActivePlayer: getActivePlayer,
    };
};

StartState();


// function DomController() {






//     newGameBtn.addEventListener('click', newGameHandler);



//     return { createBoard, d }
// }


