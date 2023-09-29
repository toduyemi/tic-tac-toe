function Gameboard() {
    const gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    gameboard.forEach(row => {
        row.forEach(square => {
            square = SquareObject();
        });
    });

    function SquareObject() {
        const square = {};
        square.value = null;
        square.tokenCheck = false;

        const addToken = token => {
            if (!square.tokenCheck) {
                return null;
            }

            square.value = token;
            square.tokenCheck = true;
        }

        const getValue = () => square.value;

        return { addToken, getValue };
    }

    const dropToken = (row, col, player) => {
        if (!gameboard[row][col].addToken(player.token)) {
            return null;
        }
    }

    const getBoard = () => gameboard;

    const printBoard = () => {
        currentBoard = gameboard.map(row => row.map(square => SquareObject.getValue()));
    }


    return { getBoard, printBoard, dropToken };
};

const Player = (name, token) => {
    const player = {};
    player.name = name;
    player.token = token;

    return player;

}


const GameController = (function () {
    const PlayerOne = Player("PlayerOne", "x");
    const PlayerTwo = Player("PlayerTwo", "o");

    let activePlayer;

    const game = Gameboard();

    const switchPlayer = () => {
        activePlayer = activePlayer !== PlayerTwo ? PlayerOne : PlayerTwo;
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        game.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, col) => {
        game.dropToken(row, col, activePlayer.token);
        console.log(`Dropping ${getActivePlayer().token} onto square ${row}${col}.`)

        //win logic here

        switchPlayer();
        printNewRound();
    }

    printNewRound;
    return { playRound, getActivePlayer };
})();
