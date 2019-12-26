new p5();
const BACKGROUND_COLOR = color("rgba(255,255,255,0.7)");

let boardSize, cellSize, strokeSize;
let board, cells, gameState;
let ai = "x";
let human = "o";
let currPlayer = ai;

let cellFactory = {
    x: (x,y) => new Cross(x,y),
    o: (x,y) => new Naught(x,y)
}

function reset() {
    board = ['', '', '',
             '', '', '',
             '', '', ''];
    cells = new Set();
}

function aiMove() {
    let score = { bestScore: currPlayer === 'x' ? -Infinity : Infinity, bestMove: -1};
    for (let i in board) {
        if (board[i] === '') {
            board[i] = currPlayer;
            let minimaxEval = minimax(board, 0, currPlayer === 'o');
            if (currPlayer === 'x') {
                if (minimaxEval > score.bestScore) {
                    score.bestScore = minimaxEval;
                    score.bestMove = i;
                }
            } else {
                if (minimaxEval < score.bestScore) {
                    score.bestScore = minimaxEval;
                    score.bestMove = i;
                }
            }
            board[i] = '';
        }
    }
    let x = score.bestMove % 3;
    let y = Math.floor(score.bestMove / 3);
    placeCell(x, y);
}

function placeCell(targetCellX, targetCellY) {
    let targetCell = targetCellX + targetCellY * 3;
    
    if (board[targetCell] === '') {
        board[targetCell] = currPlayer;
        cells.add(cellFactory[currPlayer](targetCellX, targetCellY));
        currPlayer = currPlayer === ai ? human : currPlayer === human ? ai : "How did this happen?";
        gameState = getState(board);
    }
}

function mousePressed() {
    if (mouseX < 0 || mouseY < 0) { return; }
    if (mouseX > boardSize || mouseY > boardSize) { return; }
    let targetCellX = Math.floor(mouseX / cellSize);
    let targetCellY = Math.floor(mouseY / cellSize);
    placeCell(targetCellX, targetCellY);
}

function calcScale() {
    console.log("scaling!");
    boardSize = Math.min(windowWidth - 50, windowHeight - 150);
    cellSize = boardSize / 3;
    strokeSize = cellSize / 40;
    resizeCanvas(boardSize, boardSize);
    fixButton();
}

function setup() {
    createCanvas(boardSize, boardSize).parent("canvasHolder");
    calcScale();
    setInterval(calcScale, 7000);
    reset();
}

function draw() {
    clear();

    for (let i in board) {
        fill(BACKGROUND_COLOR);
        strokeWeight(strokeSize / 2);
        stroke(0);
        let x = i % 3;
        let y = Math.floor(i / 3);
        push();
        translate(x * cellSize, y * cellSize);
        rect(0,0,cellSize,cellSize, cellSize / 7, cellSize / 7);
        pop();
    }

    for (let cell of cells) {
        cell.draw();
    }

    if (gameState) {
        if (gameState.winner === "x" || gameState.winner === "o") {
            strokeWeight(strokeSize * 3);
            stroke(200,0,200);

            let x1 = gameState.start % 3;
            let y1 = Math.floor(gameState.start / 3);
            let x2 = gameState.end % 3;
            let y2 = Math.floor(gameState.end / 3);

            line(x1 * cellSize + cellSize / 2, y1 * cellSize + cellSize / 2,
                 x2 * cellSize + cellSize / 2, y2 * cellSize + cellSize / 2);

        } else if (gameState.winner === "tie") {
        } 
    }
}

console.log("tictactoe.js loaded");