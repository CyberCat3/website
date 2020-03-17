// BRING-IN scenes/menu.js
// BRING-IN https://cdn.jsdelivr.net/npm/p5

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

let currScene = new Menu();

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    currScene.draw();
}

function mouseMoved() {
    currScene.handleMouseMoved();
}

function mouseClicked() {
    currScene.handleMouseClicked();
}