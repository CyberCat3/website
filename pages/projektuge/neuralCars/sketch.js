const POPULATION_SIZE = 80;
let courseWalls;

const keysPressed = new Set();

let minSide;

const cam = {zoom: 2, posX: 0, posY: 0, targetX: 0, targetY: 0}

const cars = [];
let carImg;

let prevFps = [];
let generationCounter = 1;
let bestLastGeneration = -1;


function preload() {
    courseWalls = loadJSON("course.json");
    carImg = loadImage("car.png");
}

function setup() {
    courseWalls = Object.values(courseWalls); // loadJSON returns indexed object, this turns it into an array.

    createCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);

    for (let i = 0; i < POPULATION_SIZE - 1; ++i) {
        cars.push(new Car(-0.8, -0.8));
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
        car.drawVisionLines();
    }

    for (const currLine of courseWalls) {
        line(nptw(currLine.pa.x), nptw(currLine.pa.y), nptw(currLine.pb.x), nptw(currLine.pb.y));
    }

    for (const car of cars) {
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
    cars[0].brain.draw(0,windowHeight-250,300,250, false);
}

const normalPlaneToWindow = val => map(val, -1, 1, -minSide / 2, minSide / 2);
const nptw = normalPlaneToWindow;
const distSq = (x1,y1, x2,y2) => Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);

let speedTimer;

function keyPressed() {
    keysPressed.add(key);
    if (key === "f") {
        if (speedTimer) {
            clearInterval(speedTimer);
            speedTimer = undefined;
        } else {
            speedTimer = setInterval(redraw, 1);
        }
    }
}

function keyReleased() {
    keysPressed.delete(key);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);
}

function resetAndEvolve() {
    cars.sort((c1, c2) => c2.timesUpdated - c1.timesUpdated);
    if (cars[0].timesUpdated != bestLastGeneration) {
        console.log(`The AI improved: ${cars[0].timesUpdated}`);
    }
    bestLastGeneration = cars[0].timesUpdated;

    for (let i = 0; i < POPULATION_SIZE / 2; ++i) {
        cars.pop();
    }
    
    for (let i = 0; i < POPULATION_SIZE / 2; ++i) {
        const myNewCar = new Car(-0.8, -0.8);
        myNewCar.brain = cars[i].brain.clone();
        myNewCar.brain.mutate(0.2);
        cars.push(myNewCar);
        cars[i].reset(-0.8, -0.8);
    }
    ++generationCounter;
    if (generationCounter == 41) {
        noLoop(); // Stop the simulation while the good car is loading.
        fetch("good_car.json").then(data => data.json()) // Get the good car and make it json.
        .then(json => {
            myNewCar = new Car(-0.8, -0.8); // Create a new car
            myNewCar.brain.network = json.brain.network; // Put in the loaded brain
            const nn = myNewCar.brain.network; // Handle for the brain
            nn[0].forEach(ip => ip.activation = InputPerceptron.prototype.activation); // Add activation functions for the input
            for (let i = 1; i < nn.length; ++i) {
                nn[i].forEach(p => p.activation = Perceptron.prototype.activation); // Add activation functions for the rest
                nn[i].forEach(p => p.children = nn[i-1]); // Connect the neurons.
            }
            cars.push(myNewCar);
            loop(); // Start the simulation when the good car has loaded.
            console.log("Loaded good car");
        });
    }
}