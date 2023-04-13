const Player = (name, marker, isTurn) => {
    return {
        name,
        marker,
        isTurn
    };
};

let playerOne = Player('player1', 'X', true);
let playerTwo = Player('player2', 'O', false);

const GameBoard = (function () {
    // Variables
    let _board = ['', '', '', '', '', '', '', '', ''];

    // Get array of tiles
    const _tiles = document.querySelectorAll('.tile');

    // Display mark on the board according to player
    const _displayMarks = function (i) {
        if (playerOne.isTurn === true) {
            _board[i] = playerOne.marker;
        }
        else if (playerTwo.isTurn === true) {
            _board[i] = playerTwo.marker;
        }

        _tiles[i].textContent = _board[i];
    };

    // Let player pick tile on the board
    const pickTile = function () {
        // Loop through to add click event
        for (let i = 0; i < _tiles.length; i++) {
            // Add click event
            _tiles[i].addEventListener('click', () => {
                // Prevent player from picking marked tile
                if (_tiles[i].textContent === '') {
                    // Call display mark and send 'i' to set the correct index
                    _displayMarks(i);
                    // Switch turn after a player selected a mark
                    switchTurn();
                }
            });
        }
    };

    // Siwtch player turn
    const switchTurn = function () {
        if (playerOne.isTurn) {
            playerOne.isTurn = false;
            playerTwo.isTurn = true;
        }
        else if (playerTwo.isTurn) {
            playerTwo.isTurn = false;
            playerOne.isTurn = true;
        }
    };

    const startGame = function () {
        pickTile();
    };

    return {
        startGame,
    };


})();

const displayController = (function () {

})();

GameBoard.startGame();