const POPULATION_SIZE = 80;  // The initial population size, it wont change.
const LEARNING_RATE = 0.20; // How mutative mutations are.
let drawDeadCars = false; // Whether or not dead cars should be drawn.
let drawVisionLines = false; // Whether or not to draw vision lines.

let rawCourseJSON, courseWalls, startingPosition;

let minSide;

const cam = {zoom: 2, posX: 0, posY: 0, targetX: 0, targetY: 0}

const cars = [];
let carImg;

let prevFps = [];
let generationCounter = 1;
let bestLastGeneration = -1;
let timesSinceLastImprovement = 0;

// My neural network library uses a sigmoid function, this replaces that with a ReLU, as that is better.
sigmoid = n => Math.max(0,n);

function preload() {
    if (!window.location.href.match(/load_custom_course/)) {
        rawCourseJSON = loadJSON("course.json");
    }
    carImg = loadImage("car.png");
}

function setup() {

    if (window.location.href.match(/load_custom_course/)) {
        const rawJson = JSON.parse(sessionStorage.getItem("neuralCarsCreator-customCourse"));
        startingPosition = [rawJson.startX, rawJson.startY];
        courseWalls = rawJson.walls;
    } else {
        startingPosition = [rawCourseJSON.startX, rawCourseJSON.startY];
        courseWalls = Object.values(rawCourseJSON.walls); // loadJSON returns indexed object, this turns it into an array.
    }

    createCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);

    for (let i = 0; i < POPULATION_SIZE; ++i) {
        cars.push(new Car(...startingPosition));
    }
}

function draw() {
    let anyCarAlive = false;
    for (const car of cars) {
        if (!car.dead) {
            car.update();
            cam.targetX = car.x;
            cam.targetY = car.y;
            anyCarAlive = true;
        }
    }
    if (!anyCarAlive) {
        resetAndEvolve();
    }

    push();
    translate(windowWidth / 2, windowHeight / 2);
    scale(cam.zoom);
    cam.posX += (cam.targetX - cam.posX) / 30;
    cam.posY += (cam.targetY - cam.posY) / 30;
    translate(cam.posX * -minSide / 2, cam.posY * -minSide / 2);

    background(50);
    
    fill(255);
    stroke(255);
    strokeWeight(3);

    for (const car of cars) {
        if (car.dead || !drawVisionLines) {
            continue;
        }
        car.drawVisionLines();
    }

    for (const currLine of courseWalls) {
        line(nptw(currLine.pa.x), nptw(currLine.pa.y), nptw(currLine.pb.x), nptw(currLine.pb.y));
    }

    for (const car of cars) {
        if (car.dead && !drawDeadCars) {
            continue;
        }
        car.draw();
    }

    pop();
    textSize(36);
    fill(255);
    stroke(255);

    prevFps.push(frameRate());
    let average = 0;
    for (const f of prevFps) {
        average += f;
    }

    average /= prevFps.length;
    text(`FPS: ${Math.round(average)}\nGeneration: ${generationCounter}`, 5, 36);
    if (prevFps.length > 60) {
        prevFps.unshift();
    }

    for (const car of cars) {
        if (!car.dead) {
            car.brain.draw(5,windowHeight-255,300,250, false);
            break;
        }
    }
}

const normalPlaneToWindow = val => map(val, -1, 1, -minSide / 2, minSide / 2);
const nptw = normalPlaneToWindow;
const distSq = (x1,y1, x2,y2) => Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);

let speedTimer;

function keyPressed() {
    if (key === "f") {
        if (speedTimer) {
            clearInterval(speedTimer);
            speedTimer = undefined;
        } else {
            speedTimer = setInterval(redraw, 1);
        }
    } else if (key === "e") {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/creator";
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);
}

function resetAndEvolve() {
    // Sort the cars based on performance
    cars.sort((c1, c2) => c2.timesUpdated - c1.timesUpdated);

    // Log AI Improvements.
    if (cars[0].timesUpdated > bestLastGeneration) {
        console.log(`The AI improved: ${cars[0].timesUpdated} Last Improvement: ${timesSinceLastImprovement} gens. ago`);
        timesSinceLastImprovement = 0;
    }
    bestLastGeneration = cars[0].timesUpdated;
    ++timesSinceLastImprovement;

    // Kill the worst performing.
    for (let i = 0; i < POPULATION_SIZE / 3 * 2; ++i) {
        cars.pop();
    }

    // Creates an array of reproduction chances.
    const chances = normaliseArr(cars.map(car => car.timesUpdated));

    // Reset the cars that remain alive.
    cars.forEach(car => car.reset(...startingPosition));

    // repopulate based on the chances
    while (cars.length < POPULATION_SIZE) {
        const oldCar = selectWithChanceMap(cars, chances);
        const newCar = new Car(...startingPosition);
        newCar.brain = oldCar.brain.clone();
        newCar.brain.mutate(LEARNING_RATE);
        cars.push(newCar);
    }


    // Increment generation counter
    ++generationCounter;
}

function normaliseArr(arr) {
    const sum = arr.reduce((pv, cv) => pv + cv);
    return arr.map(n => n / sum);
}

function selectWithChanceMap(source, chances) {
    const minLength = Math.min(source.length, chances.length);
    let num = Math.random();
    for (let i = 0; i < minLength; ++i) {
        if ((num -= chances[i]) <= 0) {
            return source[i];
        }
    }
}