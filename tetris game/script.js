// script.js

const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const rows = 20;
const cols = 10;
let score = 0;

// Create the game grid
let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

// Tetromino shapes and their rotations
const tetrominoes = [
    [ [1, 1, 1, 1] ],
    [ [1, 1], [1, 1] ],
    [ [1, 1, 1], [0, 1, 0] ],
    [ [1, 1, 0], [0, 1, 1] ],
    [ [0, 1, 1], [1, 1, 0] ],
    [ [1, 1, 1], [1, 0, 0] ],
    [ [1, 1, 1], [0, 0, 1] ]
];

let currentTetromino;
let currentPos;

// Initialize the game
function init() {
    currentTetromino = getRandomTetromino();
    currentPos = { x: Math.floor(cols / 2) - 1, y: 0 };
    draw();
}

// Get a random tetromino
function getRandomTetromino() {
    const tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return tetromino.map(row => row.slice());
}

// Draw the grid and current tetromino
function draw() {
    gameArea.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            if (grid[row][col]) {
                cell.style.backgroundColor = 'white';
            }
            gameArea.appendChild(cell);
        }
    }
    drawTetromino();
}

// Draw the current tetromino on the grid
function drawTetromino() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const posX = currentPos.x + x;
                const posY = currentPos.y + y;
                const cell = gameArea.children[posY * cols + posX];
                cell.style.backgroundColor = 'white';
            }
        });
    });
}

// Move the tetromino down
function moveDown() {
    if (canMove(0, 1)) {
        currentPos.y++;
    } else {
        merge();
        removeFullRows();
        currentTetromino = getRandomTetromino();
        currentPos = { x: Math.floor(cols / 2) - 1, y: 0 };
    }
    draw();
}

// Check if the tetromino can move
function canMove(offsetX, offsetY) {
    return currentTetromino.every((row, y) => {
        return row.every((value, x) => {
            const newX = currentPos.x + x + offsetX;
            const newY = currentPos.y + y + offsetY;
            return value === 0 || (isInsideGrid(newX, newY) && grid[newY][newX] === 0);
        });
    });
}

// Check if the position is inside the grid
function isInsideGrid(x, y) {
    return x >= 0 && x < cols && y < rows;
}

// Merge the tetromino into the grid
function merge() {
    currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                grid[currentPos.y + y][currentPos.x + x] = value;
            }
        });
    });
}

// Remove full rows
function removeFullRows() {
    grid = grid.filter(row => row.some(cell => cell === 0));
    const newRows = Array.from({ length: rows - grid.length }, () => Array(cols).fill(0));
    grid = [...newRows, ...grid];
    updateScore();
}

// Update the score
function updateScore() {
    score++;
    scoreDisplay.textContent = score;
}

// Handle user input
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            if (canMove(-1, 0)) {
                currentPos.x--;
            }
            break;
        case 'ArrowRight':
            if (canMove(1, 0)) {
                currentPos.x++;
            }
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotate();
            break;
    }
    draw();
});

// Rotate the tetromino
function rotate() {
    const rotatedTetromino = currentTetromino[0].map((_, index) =>
        currentTetromino.map(row => row[index]).reverse()
    );
    const backup = currentTetromino;
    currentTetromino = rotatedTetromino;
    if (!canMove(0, 0)) {
        currentTetromino = backup;
    }
}

// Start the game
init();
setInterval(moveDown, 1000);
