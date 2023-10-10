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
    // gameboard.forEach(row => {
    //     row.forEach(square => {
    //         square = SquareObject();
    //     });
    // });

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

        const getValue = () => square.value;

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

    const getBoard = () => gameboard.map(row => row.map(square => square.getValue()));

    // const printBoard = () => {
    //     const currentBoard = gameboard.map(row => row.map(square => square.getValue()));
    //     console.log(currentBoard);
    //     return currentBoard;
    // }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < col; j++) {
                gameboard[i][j] = SquareObject();
            }
        }
    }


    return { getBoard, /*printBoard,*/ dropToken, resetBoard };
};

const xToken = `<svg fill="#000000" height="250px" width="250px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
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


function GameController() {
    let PlayerOne = Player("PlayerOne", 1, xToken);
    let PlayerTwo = Player("PlayerTwo", 2, oToken);

    let activePlayer = PlayerOne;

    const game = Gameboard();

    const switchPlayer = () => {
        activePlayer = (activePlayer !== PlayerOne) ? PlayerOne : PlayerTwo;
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        // game.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (col, row) => {

        // only switch player or check win if it doesn't return null
        if (game.dropToken(row, col, getActivePlayer().token)) {
            console.log(`Dropping ${getActivePlayer().token} onto square ${col}, ${row}.`)

            //win logic here
            if (checkWin(getActivePlayer().token)) {
                console.log(`${getActivePlayer().name} WINS!`);
            }

            else {
                switchPlayer();
                printNewRound();
            }
        }

    }

    const checkWin = (token) => {

        const currentBoard = game.getBoard();
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

    const resetGame = () => {
        console.log('Time for a new game!')
        game.resetBoard();
    }
    printNewRound();


    return {
        playRound: playRound,
        getActivePlayer: getActivePlayer,
        getBoard: game.getBoard,
        resetGame: resetGame
    };
};


const gameBoardDiv = document.querySelector('.board-container');
const domController = () => {
    const play = GameController();

    updateBoard();
    const gameTileDivs = document.querySelectorAll('.grid-square');

    function updateBoard() {
        for (let i = 0; i < 3; i++) {
            const gridRow = document.createElement('div');
            gridRow.classList.add('grid-row');
            gameBoardDiv.appendChild(gridRow);

            for (let j = 0; j < 3; j++) {
                const gridSquare = document.createElement('div')
                gridSquare.classList.add('grid-square');

                gridSquare.setAttribute('data-index-x', `${i}`);
                gridSquare.setAttribute('data-index-y', `${j}`);
                gridRow.appendChild(gridSquare);
            }
        }
    }

    function dropHTMLToken(target) {

        const svgContainer = document.createElement('div');

        svgContainer.innerHTML = play.getActivePlayer().htmlToken;

        target.appendChild(svgContainer);
        console.log(target);

    }

    gameTileDivs.forEach(square => {
        square.addEventListener('click', (e) => {
            currentCol = +e.target.getAttribute('data-index-x');
            currentRow = +e.target.getAttribute('data-index-y');
            dropHTMLToken(e.target);
            play.playRound(currentCol, currentRow);

        }, { once: true }) //extra insurance to prevent playing on same tile
    })

    return { updateBoard, play }
}

domController();
