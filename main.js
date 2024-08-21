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
    }

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

    // Needs to be updated
   const playRound = (row,column) => {
    
    board.markCell(row, column, getActivePlayer().token);

    if (board)

    switchPlayerTurn();
    printNewRound();
   };

    // Initial play game message
    printNewRound();

    return { playRound, getActivePlayer }
};

const game = GameController();

    // Assign players 1 and 2
    // Switch between player turns
    // End game if player has 3 squares in a row, column, or diagonal; declare winner
    // End game if all squares are filled and win condition is not met, declare tie

// Displaycontroller
    // Display board
    // Update board