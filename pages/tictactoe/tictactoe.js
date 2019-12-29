new p5();
const BACKGROUND_COLOR = color("rgba(255,255,255,0.7)");
const PLAYER_X = 'x';
const PLAYER_O = 'o';
const GAME_TIE = 'tie';

let boardSize, cellSize, strokeSize;
let board, cells, gameState;
let currPlayer; 

let cellFactory = {
    x: (x,y) => new Cross(x,y),
    o: (x,y) => new Naught(x,y)
}

function reset() {
    board = ['', '', '',
             '', '', '',
             '', '', ''];
    cells = new Set();
    currPlayer = PLAYER_X;
}

function placeCell(targetCellX, targetCellY) {
    let targetCell = targetCellX + targetCellY * 3;
    
    if (gameState) {
        return;
    }

    if (board[targetCell] === '') {
        board[targetCell] = currPlayer;
        cells.add(cellFactory[currPlayer](targetCellX, targetCellY));
        currPlayer = currPlayer === PLAYER_X ? PLAYER_O : currPlayer === PLAYER_O ? PLAYER_X : "How did this happen?";
        changeCurrPlayerIndicator(currPlayer.toUpperCase());
        gameState = getState(board);
        if (gameState) {
            console.log(gameState.winner);
        }
    }
}

const ais = [
    "Human", "George", "Bob", "Kurt", "Jaibel"
]

function changeAI(player, ai) {
    console.log(`${player} is now ${ais[ai]}`);
}

function mousePressed() {
    if (mouseX < 0 || mouseY < 0) { return; }
    if (mouseX > boardSize || mouseY > boardSize) { return; }
    let targetCellX = Math.floor(mouseX / cellSize);
    let targetCellY = Math.floor(mouseY / cellSize);
    placeCell(targetCellX, targetCellY);
}

function calcScale() {
    boardSize = Math.min(windowWidth - 50, windowHeight - 200);
    cellSize = boardSize / 3;
    strokeSize = cellSize / 40;
    resizeCanvas(boardSize, boardSize);
    fixButton();
}

function setup() {
    createCanvas(boardSize, boardSize).parent("canvasHolder");
    calcScale();
    setInterval(calcScale, 3000);
    reset();
}

function draw() {
    clear();

    for (let i in board) {
        fill(BACKGROUND_COLOR);
        //strokeWeight(strokeSize / 2);
        strokeWeight(1);
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
        if (gameState.winner === PLAYER_X || gameState.winner === PLAYER_O) {
            strokeWeight(strokeSize * 3);
            stroke(200,0,200);

            let x1 = gameState.start % 3;
            let y1 = Math.floor(gameState.start / 3);
            let x2 = gameState.end % 3;
            let y2 = Math.floor(gameState.end / 3);

            line(x1 * cellSize + cellSize / 2, y1 * cellSize + cellSize / 2,
                 x2 * cellSize + cellSize / 2, y2 * cellSize + cellSize / 2);

        } else if (gameState.winner === GAME_TIE) {
        } 
    }
}

console.log("tictactoe.js loaded");