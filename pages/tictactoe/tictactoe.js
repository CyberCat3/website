new p5();
const BACKGROUND_COLOR = color("rgba(255,255,255,0.7)");

let boardSize = 400;
let cellSize = boardSize / 3;

function setup() {
    createCanvas(boardSize, boardSize).parent("canvasHolder");
    calcScale();
    setInterval(calcScale, 7000);
}

function calcScale() {
    console.log("scaling!");
    boardSize = Math.min(windowWidth - 50, windowHeight - 150);
    cellSize = boardSize / 3;
    resizeCanvas(boardSize, boardSize);
    fixButton();
}

let board = ['', '', '',
             '', '', '',
             '', '', '']

function draw() {
    clear();

    for (let i in board) {
        fill(BACKGROUND_COLOR);
        stroke(0);
        let x = i % 3;
        let y = Math.floor(i / 3);
        push();
        translate(x * cellSize, y * cellSize);
        rect(0,0,cellSize,cellSize, cellSize / 7, cellSize / 7);
        pop();
    }

}