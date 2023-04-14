/* Player factory function to create player object. */
const Player = (name, marker, isTurn) => {
    return {
        name,
        marker,
        isTurn
    };
};

/* Module for main logic of the game. */
const GameBoard = (function () {
    // Variables for the game.
    let _board = ['', '', '', '', '', '', '', '', ''];
    // Winning combinations, there's 8 possibilities.
    let _winCombs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Variables for players.
    let _playerX = {};
    let _playerO = {};

    // Get player information before game starts.
    const _getPlayerInfo = function () {
        const playerXName = document.querySelector('.player-x').value;
        const playerOName = document.querySelector('.player-o').value;
        
        // If players did not input name e.g. using 'Quick Start' button
        // Let the name be 'Player X' and 'Player O'.
        if (playerXName === '' && playerOName === '') {
            _playerX = Player('Player X', 'X', true);
            _playerO = Player('Player O', 'O', false);
        }
        // If players put in names, let the name be the input values.
        else {
            _playerX = Player(playerXName, 'X', true);
            _playerO = Player(playerOName, 'O', false);
        }
    };

    // Let player play the game by picking a tile.
    const _play = function () {
        // Initialize displays.
        displayController.duringGameDisplay();
        displayController.displayPlayerTurn(_playerX, _playerO);

        // Get array of tiles.
        const _tiles = document.querySelectorAll('.tile');

        // Loop through to add click event.
        for (let index = 0; index < _tiles.length; index++) {
            _tiles[index].addEventListener('click', () => {
                // Prevent player from picking marked tile.
                if (_tiles[index].textContent === '') {
                    // Call display mark and send 'index' to match tile(div element) and _board array element.
                    displayController.displayMarks(index, _board, _playerX, _playerO);
                    // Switch turn after a player selected a mark.
                    _switchTurn();
                    // Update player turn display.
                    displayController.displayPlayerTurn(_playerX, _playerO);
                    // Check and display the result if a player has won or the game ended in a tie.
                    _checkResult();
                }
            });
        }
    };

    // Siwtch player turn.
    const _switchTurn = function () {
        if (_playerX.isTurn) {
            _playerX.isTurn = false;
            _playerO.isTurn = true;
        }
        else if (_playerO.isTurn) {
            _playerO.isTurn = false;
            _playerX.isTurn = true;
        }
    };

    // Check if a player has won or a tie.
    const _checkResult = function () {
        // Loop through win combinations.
        for (let i = 0; i < _winCombs.length; i++) {
            // Get a win combination according to index
            const winComb = _winCombs[i];

            // Set a, b, c according to win combination indexes 
            // e.g. First iteration -> [a, b, c] = [0, 1, 2]
            // Second iteration -> [a, b, c] = [3, 4, 5]
            const a = _board[winComb[0]]; // => a = _board[0 or 3 or 6 ...]
            const b = _board[winComb[1]]; // => b = _board[1 or 4 or 7 ...]
            const c = _board[winComb[2]]; // => c = _board[2 or 5 or 8 ...]

            // If a or b or c combination is empty, continue the loop.
            if (a === '' || b === '' || c === '') {
                continue;
            }
            // If there's a match display result and break out of the loop.
            // e.g. (_board[1] === _board[4] && _board[4] === _board[7]) 
            // e.g. [1, 4, 7] === [X, X, X] or [O, O, O]
            if (a === b && b === c) {
                displayController.displayResult(true, _playerX, _playerO);
                break;
            }
            // If there's no match display result as a tie and return.
            if (!_board.includes("")) {
                displayController.displayResult(false);
                return;
            }
        }
    };

    // Reset the game, set each index of _board array to '' (empty).
    const _resetGame = function () {
        for (let tile in _board) {
            _board[tile] = '';
        }
    };

    // Reset player info, remove players' names, and clear name input fields.
    const _resetPlayers = function () {
        _playerX.name = '';
        _playerO.name = '';
        displayController.resetPlayersNameInput();
    };

    // Initialize the game according to buttons.
    const initializeGame = function () {
        // Variables to assign event listeners
        const playersDetailsForm = document.querySelector('.players-details');
        const quickStartButton = document.querySelector('.quick-start');
        const restartButton = document.querySelector('.restart-game');
        const startOverButton = document.querySelector('.start-over');

        // Initialize initial display.
        displayController.beforeGameDisplay();

        // Start game with custom names.
        playersDetailsForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submit behavior.
            _getPlayerInfo(); // Get players info (names).
            _play(); // Start playing.
        });

        // Start game without custom(input) names.
        quickStartButton.addEventListener('click', () => {
            const playersNameInput = document.querySelectorAll('input');
            // Remove required attribute from name inputs to allow empty fields.
            playersNameInput.forEach(input => {
                input.removeAttribute('required');
            });

            _getPlayerInfo(); // Get players info (names).
            _play(); // Start playing.
        });

        // Restart the game
        restartButton.addEventListener('click', () => {
            // Reset
            _resetGame();
            displayController.resetDisplay(_playerX);

            _getPlayerInfo(); // Get players info (names).
            _play(); // Start playing.
        });

        // Start over e.g. input new names or choose quick start.
        startOverButton.addEventListener('click', () => {
            // Reset
            _resetGame();
            displayController.resetDisplay(_playerX);
            _resetPlayers();

            // Call itself to start all over.
            initializeGame();
        });
    };

    return {
        initializeGame,
    };
})();

/* Module to handle displays. */
const displayController = (function () {
    // Variables for each display elements.
    const _boardContainer = document.querySelector('.board');
    const _tiles = document.querySelectorAll('.tile');
    const _playersDetailsForms = document.querySelector('.players-details');
    const _playerXNameInput = document.querySelector('.player-x');
    const _playerONameInput = document.querySelector('.player-o');
    const _display = document.querySelector('.display');
    const _playerTurnDisplay = document.querySelector('.player-turn');
    const _resultDisplay = document.querySelector('.display-result');
    const _restartButton = document.querySelector('.restart-game');
    const _startOverButton = document.querySelector('.start-over');

    // Display before game starts.
    const beforeGameDisplay = function () {
        _boardContainer.style.pointerEvents = 'auto';
        _boardContainer.style.display = 'none';
        _display.style.display = 'none';
        _playersDetailsForms.style.display = '';
    };

    // Display during gameplay.
    const duringGameDisplay = function () {
        _boardContainer.style.pointerEvents = 'auto';
        _boardContainer.style.display = '';
        _playersDetailsForms.style.display = 'none';
        _display.style.display = '';
        _playerTurnDisplay.style.display = '';
        _resultDisplay.style.display = 'none';
        _restartButton.style.display = 'none';
        _startOverButton.style.display = 'none';
    };

    // Display after gameplay (A player has won or a tie).
    const afterGameDisplay = function () {
        _boardContainer.style.pointerEvents = 'none';
        _playerTurnDisplay.style.display = 'none';
        _resultDisplay.style.display = '';
        _restartButton.style.display = '';
        _startOverButton.style.display = '';
    };

    // Display marks according to players (turn).
    const displayMarks = function (index, board, playerX, playerO) {
        if (playerX.isTurn === true) {
            board[index] = playerX.marker;
        }
        else if (playerO.isTurn === true) {
            board[index] = playerO.marker;
        }

        _tiles[index].textContent = board[index];
    };

    // Display result according to winner or a tie.
    const displayResult = function (result, playerX, playerO) {
        if (result === true) {
            // If a turn has switched to player O but player X has won
            // then display that player X has won.
            if (playerX.isTurn === false && playerO.isTurn === true) {
                _resultDisplay.textContent = `${playerX.name} Wins!`;
            }
            // Vice versa
            else {
                _resultDisplay.textContent = `${playerO.name} Wins!`;
            }
            afterGameDisplay();
        }
        // e.g. if result = false -> It's a tie.
        else {
            _resultDisplay.textContent = "It's a tie!";
            afterGameDisplay();
        }
    };

    // Display player turn by checking .isTrue
    const displayPlayerTurn = function (playerX, playerO) {
        if (playerX.isTurn === true) {
            _playerTurnDisplay.innerHTML = `It's <span>${playerX.name}</span> turn`;
        }
        else if (playerO.isTurn === true) {
            _playerTurnDisplay.innerHTML = `It's <span>${playerO.name}</span> turn`;
        }
    };

    // Reset (remove) all marks from tile element.
    const resetDisplay = function (playerX) {
        for (let tile in _tiles) {
            _tiles[tile].textContent = '';
        }

        _playerTurnDisplay.textContent = `It's ${playerX.name} turn`;
    };

    // Reset (remove) value of the name inputs.
    const resetPlayersNameInput = function () {
        _playerXNameInput.value = '';
        _playerONameInput.value = '';
    };
    
    return {
        displayMarks,
        displayResult,
        displayPlayerTurn,
        resetDisplay,
        beforeGameDisplay,
        duringGameDisplay,
        afterGameDisplay,
        resetPlayersNameInput,
    };
})();

GameBoard.initializeGame();