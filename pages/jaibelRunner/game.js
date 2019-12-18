new p5();
const WIDTH = 1000;
const HEIGHT = 600;
const HORIZON_LINE = HEIGHT - HEIGHT / 3;
const GAME_LINE = HEIGHT - HEIGHT / 3;

const BACKGROUND_COLOR = color(150, 200, 255);
const SAND_COLOR = color(255,255,132);
const BACKGROUND_COLOR_TRANSPARENT = color(150,200,255,100);

let jaibel;
let keysPressed = new Set();

function preload() {
    let loadingHeader = document.getElementById("loadingHeader");
    loadingHeader.innerText = "Loading jaibel...";
    setupJaibel();
    loadingHeader.innerText = "Loading clouds...";
    setupClouds();
    loadingHeader.innerText = "Loading obstacles...";
    setupObstacles();
}

function keyPressed() {
    keysPressed.add(key);
}

function keyReleased() {
    keysPressed.delete(key);
}

function setup() {
    jaibel = new Jaibel();
    createCanvas(WIDTH, HEIGHT);
}
let spawnCloudIn = 0;
let spawnObstacleIn = 0;
let clouds = new Set();
let obstacles = new Set();

function draw() {
    if (--spawnCloudIn < 0) {
        spawnCloudIn = random(120, 160);
        let cloud = new Cloud(() => clouds.delete(cloud));
        clouds.add(cloud);
    }
    if (--spawnObstacleIn < 0) {
        spawnObstacleIn = random(60, 160);
        let obstacle = new Obstacle(jaibel, () => obstacles.delete(obstacle), () => {
            console.log("Jaibel collided");
        });
        obstacles.add(obstacle);
    }
    background(BACKGROUND_COLOR);
    noStroke();
    rectMode(CORNER);
    fill(SAND_COLOR);
    rect(0, HORIZON_LINE, WIDTH, HEIGHT);

    for (let cloud of clouds) {
        cloud.update();
        cloud.draw();
    }

    for (let obstacle of obstacles) {
        obstacle.update();
        obstacle.draw();
    }

    // fill(BACKGROUND_COLOR_TRANSPARENT);
    // rect(0,0,WIDTH,HORIZON_LINE);

    jaibel.update();
    jaibel.draw();
}

console.log("game.js loaded");
console.log("Thanks to Ben Moren for creating p5.collide2D!");