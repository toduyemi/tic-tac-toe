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
        }

        const getValue = () => square.value;

        return { addToken, getValue };
    }

    const dropToken = (row, col, token) => {

        if (!gameboard[row][col].addToken(token)) {
            return null;
        }
    }

    const getBoard = () => gameboard;

    const printBoard = () => {
        const currentBoard = gameboard.map(row => row.map(square => square.getValue()));
        console.log(currentBoard);
    }


    return { getBoard, printBoard, dropToken };
};

function Player(name, token) {
    const player = {};
    player.name = name;
    player.token = token;

    return player;

}


function GameController() {
    let PlayerOne = Player("PlayerOne", 1);
    let PlayerTwo = Player("PlayerTwo", 2);

    let activePlayer = PlayerOne;

    const game = Gameboard();

    const switchPlayer = () => {
        activePlayer = (activePlayer !== PlayerOne) ? PlayerOne : PlayerTwo;
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        game.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, col) => {
        game.dropToken(row, col, getActivePlayer().token);
        console.log(`Dropping ${getActivePlayer().token} onto square ${row}${col}.`)

        //win logic here

        switchPlayer();
        printNewRound();
    }

    printNewRound();
    return { playRound, getActivePlayer };
};

const play = GameController();
