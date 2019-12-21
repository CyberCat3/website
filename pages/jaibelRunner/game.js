new p5();
const WIDTH = 1000;
const HEIGHT = 600;
const HORIZON_LINE = HEIGHT - HEIGHT / 3;
const GAME_LINE = HEIGHT - HEIGHT / 3;

const BACKGROUND_COLOR = color(150, 200, 255);
const SAND_COLOR = color(255,255,132);
const BACKGROUND_COLOR_TRANSPARENT = color(150,200,255,100);
const TRANSPARENT_RED = color(255,0,0);
TRANSPARENT_RED.setAlpha(128);

let showHitbox = false;
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

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        noLoop();
        setTimeout(() => {
            textAlign(CENTER);
            textSize(45);
            fill(0);
            text("Pause", WIDTH / 2 + 2, HEIGHT / 2 + 2);
            fill(255);
            text("Pause", WIDTH / 2, HEIGHT / 2);
        }, 50);
    } else {
        loop();
    }
}

function keyPressed() {
    keysPressed.add(key);
    switch (key) {
        case "o":   showHitbox = !showHitbox;   break;
        case " ":   if (isDead) { reset(); }    break;
        case "p":   togglePause();              break; 
    }
}

function keyReleased() {
    keysPressed.delete(key);
}

let jaibel, spawnCloudIn, spawnObstacleIn, clouds, obstacles, isDead, isPaused, score, scoreInterval;

function setup() {
    clouds = new Set();
    createCanvas(WIDTH, HEIGHT);
    reset();
}


function reset() {
    jaibel = new Jaibel();
    spawnCloudIn = spawnObstacleIn = score = 0;
    scoreInterval = setInterval(() => ++score, 1000);
    obstacles = new Set();
    isDead = false;
    loop();
}

function died() {
    console.log("Jaibel died");
    noLoop();
    clearInterval(scoreInterval);
    setTimeout(() => {
        isDead = true;
        textAlign(CENTER);
        textSize(45);
        fill(0);
        text("Du døede, tryk \"mellemrum\" for at prøve igen.", WIDTH / 2 + 2, HEIGHT / 2 + 2);
        fill(255);
        text("Du døede, tryk \"mellemrum\" for at prøve igen.", WIDTH / 2, HEIGHT / 2);
    }, 0);
}

let factory = {
    createCloud: () => {
        let cloud = new Cloud(() => clouds.delete(cloud));
        return cloud;
    },
    createObstacle: () => {
        let obstacle = new Obstacle(jaibel, () => obstacles.delete(obstacle), died);
        return obstacle;
    }
}

function draw() {
    if (--spawnCloudIn < 0) {
        spawnCloudIn = random(120, 160);
        clouds.add(factory.createCloud());
    }
    if (--spawnObstacleIn < 0) {
        spawnObstacleIn = random(40, 160);
        obstacles.add(factory.createObstacle());
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
    
    textSize(40);
    textAlign(LEFT);
    fill(0);
    text("Score: " + score, 9,42);
    fill(255);
    text("Score: " + score, 7,40);
}

console.log("game.js loaded");
console.log("Thanks to Ben Moren for creating p5.collide2D!");