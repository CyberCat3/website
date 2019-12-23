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

function pause() {
    isPaused = true;
    noLoop();
    setTimeout(() => funkyText("Pause", 50, 41, 128, 185, true), 50);
    clearInterval(scoreInterval);
}

function unpause() {
    isPaused = false;
    loop();
    scoreInterval = setInterval(() => ++score, 1000);
}

function touchStarted() {
    key = " ";
    keyPressed();
}

function touchEnded() {
    key = " ";
    keyReleased();
}

function keyPressed() {
    keysPressed.add(key);
    switch (key) {
        case "o":
            showHitbox = !showHitbox;
            break;
        case "w":    case "ArrowUp":    case " ":
            if (isDead) { reset(); }
            if (isPaused) { unpause(); }
            break;
        case "p":
            if (isPaused) {
                unpause();
            } else if (!isDead) {
                pause();
            }
            break; 
    }
}

function keyReleased() {
    keysPressed.delete(key);
}

let jaibel, spawnCloudIn, spawnObstacleIn, clouds, obstacles, isDead, isPaused, score, scoreInterval;

function setup() {
    let drawFunction = draw;
    draw = () => console.log("Stole the draw function!");
    setupJaibel();
    setTimeout(() => setupClouds(), 100);
    setTimeout(() => setupObstacles(), 200);
    createCanvas(WIDTH, HEIGHT);
    clouds = new Set();
    setTimeout(() => {
        draw = drawFunction;
        background(BACKGROUND_COLOR);
        noStroke();
        fill(SAND_COLOR);
        rect(0,GAME_LINE,WIDTH,HEIGHT);
        funkyText(`Tryk "mellemrum" for at starte!`, 48, 241, 196, 15, true);
        isDead = true;
    }, 50);
    noLoop();
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
        funkyText(`Du døede, tryk "mellemrum" for at prøve igen.`, 45, 231, 76, 60, true);
    }, 0);
}

const factory = {
    createCloud: () => {
        let cloud = new Cloud(() => clouds.delete(cloud));
        return cloud;
    },
    createObstacle: (type) => {
        let obstacle = new Obstacle(jaibel, type, () => obstacles.delete(obstacle), died);
        return obstacle;
    },

    createMultipleObstacles: (amount, type) => {
        let obstaclesCreated = [factory.createObstacle(type)];
        let prevObstacle = obstaclesCreated[0];
        for (let i = 1; i < amount; ++i) {
            let nextObstacle = factory.createObstacle(prevObstacle.type);
            nextObstacle.x = prevObstacle.x + nextObstacle.width * 1.1;
            obstaclesCreated.push(prevObstacle = nextObstacle);
        }
        return obstaclesCreated;
    }
}

function draw() {
    if (--spawnCloudIn < 0) {
        spawnCloudIn = random(120, 160);
        clouds.add(factory.createCloud());
    }
    if (--spawnObstacleIn < 0) {
        spawnObstacleIn = random(40, Math.max(60, 160 - score / 1.25));
            
        if (Math.random() > 0.5) {
            factory.createMultipleObstacles(2, Math.random() > 0.5 ? "cactus" : "tumbleweed").forEach((o) => obstacles.add(o));
        } else {
            obstacles.add(factory.createObstacle());
        }

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
    
    funkyText(`Score: ${score}`, 48, 46, 204, 113, false);
}

console.log("game.js loaded");
console.log("Thanks to Ben Moren for creating p5.collide2D!");