// Create game board
function Gameboard() {
    
    // Initialize 3 x 3 grid and empty board array
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create 2d array that stores the player assignment of each cell on the board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Used by UI to get board state
    const getBoard = () => board;

    // Mark cell with the player's token
    const markCell = (row, column, playerToken) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].assignCellValue(playerToken);
        }
        else {
            console.log("Cell already occupied. Choose another one.")
        }
        printBoard();
    };

    // Used for console testing before UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => 
            row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, markCell, printBoard };
}

// Handle cell values between players
function Cell() {
    let value = 0;

    const assignCellValue = (player) => {
        value = player;
    };

    // Retrieve the current value of the cell
    const getValue = () => value;

    return { assignCellValue, getValue };
}

// Control flow of the game
function GameController(playerOneName = "Player One", playerTwoName = " Player Two") {
    
    const board = Gameboard();

    const players = [
        { name: playerOneName, token: 1 },
        { name: playerTwoName, token: 2 }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    // Check to see if row win condition is met
    const checkRow = (board) => {
        for (let i = 0; i < board.length; i++) {
            const firstValue = board[i][0].getValue();
            if (firstValue !== 0 && board[i].every(cell => cell.getValue() === firstValue)) {
                return true;
            }
        }
        return false;
    };

    // Check to see if column win condition is met
    const checkColumn = (board) => {
        for (let i = 0; i < board[0].length; i++) {
            const firstValue = board[0][i].getValue();
            if (firstValue !== 0 && board.every(row => row[i].getValue() === firstValue)) {
                return true;
            }
        }
        return false;
    };

    // Check to see if diagonal win condition is met
    const checkDiagonal = (board) => {

        // Index Top Left and Bottom Right of Board
        const topLeftIndex = board[0][0];
        const topRightIndex = board[0][board.length - 1];

        const checkTopLeftBottomRight = board.every((row, i) => row[i].getValue() === topLeftIndex.getValue() && topLeftIndex.getValue() !== 0);
        const checkTopRightBottomLeft = board.every((row, i) => row[board.length - 1 - i].getValue() === topRightIndex.getValue() && topRightIndex.getValue() !== 0);

        // Return true / false status of each diagonal check
        return checkTopLeftBottomRight || checkTopRightBottomLeft;
    };

    // Check for ties
    const checkTie = (board) => {
        return board.every(row => row.every(cell => cell.getValue() !== 0));
    };

    const playRound = (row,column) => {
        board.markCell(row, column, getActivePlayer().token);

        // Announce winner if any win condition is met
        if (checkRow(board.getBoard()) || checkColumn(board.getBoard()) || checkDiagonal(board.getBoard())) {
            console.log(`${getActivePlayer().name} Wins!`);
        }
        // Announce tie if no win condition is met and all cells have a non-zero value
        else if (checkTie(board.getBoard())){
            console.log("Tie game");
        }
        else
        switchPlayerTurn();
        printNewRound();
   };

    // Initial play game message
    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard };
}

const game = GameController();

function DisplayController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateDisplay = () => {
        // Clear display
        boardDiv.textContent = "";

        // Get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn`

        // Render board squares
        board.forEach((row, rowIndex)=> { 
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                // Create data attributes to help with passing to playRound function
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                
                // Make cell textContent blank if value is zero
                cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    // Add event listener
    function clickHandlerBoard(e) {
        const clickedCell = e.target;

        if (clickedCell.classList.contains('cell')) {
            const row = parseInt(clickedCell.dataset.row);
            const column = parseInt(clickedCell.dataset.column);
            game.playRound(row, column);
            updateDisplay();
        }
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    // Initial render
    updateDisplay();
}

DisplayController();