new p5();
const BACKGROUND_COLOR = color("rgba(255,255,255,0.7)");
const PLAYER_X = 'x';
const PLAYER_O = 'o';
const GAME_TIE = 'tie';

const AGENT_HUMAN = "Human";
const AGENT_GEORGE = "George";
const AGENT_BOB = "Bob";
const AGENT_KURT = "Kurt";
const AGENT_JAIBEL = "Jaibel";

let boardSize, cellSize, strokeSize;
let board, cells, gameState;
let currPlayer, currAgent;

let agentX = AGENT_HUMAN;
let agentO = AGENT_HUMAN;

let cellFactory = {
    x: (x,y) => new Cross(x,y),
    o: (x,y) => new Naught(x,y)
}

const agentTimeouts = {};
agentTimeouts[AGENT_JAIBEL] = 300;
agentTimeouts[AGENT_KURT] = 500;
agentTimeouts[AGENT_BOB] = 600;
agentTimeouts[AGENT_GEORGE] = 700;


function reset() {
    board = ['', '', '',
             '', '', '',
             '', '', ''];
    cells = new Set();
    gameState = null;
    currPlayer = PLAYER_X;
    currAgent = agentX;
    if (currAgent !== AGENT_HUMAN) {
        setTimeout(aiMove, 300);
    }
}

function placeCell(targetCellX, targetCellY) {
    let targetCell = targetCellX + targetCellY * 3;

    if (gameState) {
        return;
    }

    console.log({currAgent});

    if (board[targetCell] === '') {
        board[targetCell] = currPlayer;
        
        cells.add(cellFactory[currPlayer](targetCellX, targetCellY));
        currPlayer = currPlayer === PLAYER_X ? PLAYER_O : currPlayer === PLAYER_O ? PLAYER_X : "How did this happen?";
        currAgent  = currPlayer === PLAYER_X ? agentX   : currPlayer === PLAYER_O ? agentO   : "This should not happen";

        if (currAgent !== AGENT_HUMAN) {
            setTimeout(aiMove, agentTimeouts[currAgent]);
        }

        changeCurrPlayerIndicator(currPlayer.toUpperCase());
        gameState = getState(board);
        if (gameState) {
            console.log(gameState.winner);
        }
    }
}

const ais = [
    AGENT_HUMAN, AGENT_GEORGE, AGENT_BOB, AGENT_KURT, AGENT_JAIBEL
]

function changeAI(player, ai) {
    if (player === PLAYER_X) {
        agentX = ais[ai];
    } else if (player === PLAYER_O) {
        agentO = ais[ai];
    } else {
        return;
    }

    currAgent  = currPlayer === PLAYER_X ? agentX   : currPlayer === PLAYER_O ? agentO   : "This should not happen";

    if (currAgent !== AGENT_HUMAN) {
        setTimeout(aiMove, 0);
    }

    console.log(`${player} is now ${ais[ai]}`);
}

function mousePressed() {
    if ((agentX ===AGENT_HUMAN && currPlayer === PLAYER_X) || (agentO === AGENT_HUMAN && currPlayer === PLAYER_O)) {
        if (mouseX < 0 || mouseY < 0) { return; }
        if (mouseX > boardSize || mouseY > boardSize) { return; }
        let targetCellX = Math.floor(mouseX / cellSize);
        let targetCellY = Math.floor(mouseY / cellSize);
        placeCell(targetCellX, targetCellY);
    }
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