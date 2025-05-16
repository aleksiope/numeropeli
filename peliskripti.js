const gridSizeSelection = document.querySelector("#ruudukon-koko");
let gridSize = gridSizeSelection.value;
document.getElementById("maxNum").innerHTML = gridSize**2;

let currentNumber = 1;
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const bestDisplay = document.getElementById('best');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const cells = [];

let bestScore = localStorage.getItem('numeropolkuBest') || 0;
if (bestScore > 0) {
    bestDisplay.textContent = `Paras tulos: ${bestScore}`;
}

function initGrid() {
    grid.innerHTML = '';
    cells.length = 0;
    for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        grid.appendChild(cell);
        cells.push(cell);
    }
    }
}

let path = [];
let undoUsed = false;

function resetGame() {
    currentNumber = 1;
    path = [];
    undoUsed = false;
    status.textContent = "Seuraava luku: 1";
    initGrid();
}

function undoMove() {
    if (undoUsed || path.length === 0) return;
    const last = path.pop();
    const index = last.row * gridSize + last.col;
    const cell = cells[index];
    cell.textContent = '';
    cell.classList.remove('filled');
    currentNumber--;
    status.textContent = `Seuraava luku: ${currentNumber}`;
    undoUsed = true;
}

function hasValidMoves(row, col) {
    const directions = [
    {dx: 3, dy: 0}, {dx: -3, dy: 0},
    {dx: 0, dy: 3}, {dx: 0, dy: -3},
    {dx: 2, dy: 2}, {dx: -2, dy: 2},
    {dx: 2, dy: -2}, {dx: -2, dy: -2},
    ];
    return directions.some(d => {
    const newRow = row + d.dy;
    const newCol = col + d.dx;
    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) return false;
    const index = newRow * gridSize + newCol;
    return !cells[index].classList.contains('filled');
    });
}

function checkGameOver() {
    if (path.length === 0) return;
    const last = path[path.length - 1];
    if (!hasValidMoves(last.row, last.col)) {
    status.textContent = "Ei enää mahdollisia siirtoja. Peli päättyi.";
    if (path.length > bestScore) {
        bestScore = path.length;
        localStorage.setItem('numeropolkuBest', bestScore);
        bestDisplay.textContent = `Paras tulos: ${bestScore}`;
    }
    }
}

gridSizeSelection.addEventListener('change', () => {
    gridSize = gridSizeSelection.value;
    grid.style.setProperty('--gridSize', gridSize);
    document.getElementById("maxNum").innerHTML = gridSize**2;
    localStorage.setItem('numeropolkuBest', 0);
    bestDisplay.textContent = `Paras tulos: -`;
    resetGame();
});

grid.addEventListener('click', (e) => {
    const cell = e.target;
    if (!cell.classList.contains('cell') || cell.classList.contains('filled')) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (isValidMove(row, col)) {
    cell.textContent = currentNumber;
    cell.classList.add('filled');
    path.push({row, col, number: currentNumber});
    currentNumber++;
    if (currentNumber > gridSize**2) {
        status.textContent = "Peli päättyi! Kaikki numerot asetettu. Hienoa! Pyydä palkinto opelta :)";
        if (path.length > bestScore) {
        bestScore = path.length;
        localStorage.setItem('numeropolkuBest', bestScore);
        bestDisplay.textContent = `Paras tulos: ${bestScore}`;
        }
    } else {
        status.textContent = `Seuraava luku: ${currentNumber}`;
        checkGameOver();
    }
    } else {
    alert("Virheellinen siirto!");
    }
});

resetBtn.addEventListener('click', resetGame);
undoBtn.addEventListener('click', undoMove);


function isValidMove(row, col) {
    if (path.length === 0) return true;
    const last = path[path.length - 1];
    const dx = col - last.col;
    const dy = row - last.row;
    if (row === last.row && Math.abs(dx) === 3) return true;
    if (col === last.col && Math.abs(dy) === 3) return true;
    if (Math.abs(dx) === 2 && Math.abs(dy) === 2) return true;
    return false;
}

initGrid();