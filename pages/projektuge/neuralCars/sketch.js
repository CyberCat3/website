let courseWalls;

const keysPressed = new Set();

let minSide;

const cam = {zoom: 2, posX: 0, posY: 0}

const cars = [];
let carImg;

function preload() {
    courseWalls = loadJSON("course.json");
    carImg = loadImage("car.png");


}

function setup() {
    courseWalls = Object.values(courseWalls); // loadJSON returns indexed object, this turns it into an array.

    createCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);

    cars.push(new Car(-0.8, -0.8));
}

function draw() {

    if (keysPressed.has("w")) {
        cam.zoom += 0.02;
    }
    if (keysPressed.has("s")) {
        cam.zoom -= 0.02;
    }
    if (keysPressed.has("ArrowUp")) {
        cam.posY -= 0.02;
    }
    if (keysPressed.has("ArrowDown")) {
        cam.posY += 0.02;
    }
    if (keysPressed.has("ArrowLeft")) {
        cam.posX -= 0.02;
    }
    if (keysPressed.has("ArrowRight")) {
        cam.posX += 0.02;
    }

    for (const car of cars) {
        car.update();
    }

    cam.posX = cars[0].x;
    cam.posY = cars[0].y;

    push();
    translate(windowWidth / 2, windowHeight / 2);
    scale(cam.zoom);
    translate(cam.posX * -minSide / 2, cam.posY * -minSide / 2);

    background(50);
    
    fill(255);
    stroke(255);
    strokeWeight(3);

    ellipse(normalPlaneToWindow( 1), normalPlaneToWindow( 1), 10, 10);
    ellipse(normalPlaneToWindow( 1), normalPlaneToWindow(-1), 10, 10);
    ellipse(normalPlaneToWindow(-1), normalPlaneToWindow( 1), 10, 10);
    ellipse(normalPlaneToWindow(-1), normalPlaneToWindow(-1), 10, 10);
    ellipse(normalPlaneToWindow( 0), normalPlaneToWindow( 0), 10, 10);

    for (const currLine of courseWalls) {
        line(
            normalPlaneToWindow(currLine.pa.x),
            normalPlaneToWindow(currLine.pa.y),
            normalPlaneToWindow(currLine.pb.x),
            normalPlaneToWindow(currLine.pb.y)
        )
    }

    for (const car of cars) {
        car.draw();
    }

    pop();
}

const normalPlaneToWindow = val => map(val, -1, 1, -minSide / 2, minSide / 2);
const distSq = (x1,y1, x2,y2) => Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
const nptw = normalPlaneToWindow;

function keyPressed() {
    keysPressed.add(key);
}

function keyReleased() {
    keysPressed.delete(key);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);
}