// script.js
document.addEventListener('DOMContentLoaded', () => {
    const rows = 6;
    const columns = 7;
    let board = Array.from(Array(rows), () => Array(columns).fill(null));
    let currentPlayer = 'red';
    let selectedColumn = 0;
    let gameEnded = false;
    
    const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const playAgainButton = document.getElementById('play-again');
    
    function renderBoard() {
        boardElement.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (board[r][c]) {
                    cell.classList.add(board[r][c]);
                }
                boardElement.appendChild(cell);
            }
        }
    }
    
    function dropDisc(column) {
        if (gameEnded) return;
        
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][column]) {
                board[r][column] = currentPlayer;
                renderBoard();
                if (checkWin()) {
                    setTimeout(() => {
                        displayMessage(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`);
                    }, 500); // Delay message to show winning disc
                    gameEnded = true;
                    playAgainButton.style.display = 'block';
                } else {
                    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                    if (currentPlayer === 'yellow') {
                        aiMove();
                    }
                }
                break;
            }
        }
    }

    function checkWin() {
        const directions = [
            { dr: 1, dc: 0 },  // vertical
            { dr: 0, dc: 1 },  // horizontal
            { dr: 1, dc: 1 },  // diagonal /
            { dr: 1, dc: -1 }  // diagonal \
        ];
        
        function checkDirection(r, c, dr, dc) {
            let count = 0;
            while (
                r >= 0 && r < rows &&
                c >= 0 && c < columns &&
                board[r][c] === currentPlayer
            ) {
                count++;
                r += dr;
                c += dc;
            }
            return count >= 4;
        }
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c] === currentPlayer) {
                    for (const { dr, dc } of directions) {
                        if (checkDirection(r, c, dr, dc)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    function displayMessage(message) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
    }
    
    function aiMove() {
        if (gameEnded) return;

        // Basic AI to check for winning move or block opponent
        const move = findBestMove();
        if (move !== null) {
            dropDisc(move);
        }
    }
    
    function findBestMove() {
        const opponent = currentPlayer === 'red' ? 'yellow' : 'red';

        for (let col = 0; col < columns; col++) {
            for (let row = rows - 1; row >= 0; row--) {
                if (!board[row][col]) {
                    // Check if this move will win the game
                    board[row][col] = currentPlayer;
                    if (checkWin()) {
                        board[row][col] = null;
                        return col;
                    }
                    board[row][col] = null;

                    // Check if opponent could win on their next move
                    board[row][col] = opponent;
                    if (checkWin()) {
                        board[row][col] = null;
                        return col;
                    }
                    board[row][col] = null;
                    break;
                }
            }
        }

        // If no winning or blocking move, choose a random valid column
        let validColumns = [];
        for (let col = 0; col < columns; col++) {
            if (!board[0][col]) {
                validColumns.push(col);
            }
        }
        return validColumns[Math.floor(Math.random() * validColumns.length)];
    }
    
    function resetGame() {
        board = Array.from(Array(rows), () => Array(columns).fill(null));
        currentPlayer = 'red';
        gameEnded = false;
        renderBoard();
        messageElement.style.display = 'none';
        playAgainButton.style.display = 'none';
    }
    
    document.getElementById('left').addEventListener('click', () => {
        if (gameEnded) return;
        selectedColumn = (selectedColumn + columns - 1) % columns;
        highlightColumn();
    });

    document.getElementById('right').addEventListener('click', () => {
        if (gameEnded) return;
        selectedColumn = (selectedColumn + 1) % columns;
        highlightColumn();
    });

    document.getElementById('drop').addEventListener('click', () => {
        dropDisc(selectedColumn);
    });

    playAgainButton.addEventListener('click', () => {
        resetGame();
    });

    function highlightColumn() {
        Array.from(boardElement.children).forEach((cell, index) => {
            const col = index % columns;
            if (col === selectedColumn) {
                cell.style.border = '2px solid blue';
            } else {
                cell.style.border = '2px solid black';
            }
        });
    }

    renderBoard();
});
