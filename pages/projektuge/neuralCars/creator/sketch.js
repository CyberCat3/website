"use strict";

let minSide;

let walls = [];

let prevX, prevY;
let startedX, startedY;
let spawnPointX, spawnPointY;

function setup() {
    createCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);

    const result = sessionStorage.getItem("neuralCarsCreator-customCourse");

    if (result) {
        const rawJson = JSON.parse(result);
        spawnPointX = rawJson.startX;
        spawnPointY = rawJson.startY;
        walls = rawJson.walls;
    }
}

function draw() {
    background(50);
    stroke(255);
    strokeWeight(3);
    noFill();
    for (const cLine of walls) {
        line(
            nptw(cLine.pa.x),
            nptw(cLine.pa.y),
            nptw(cLine.pb.x),
            nptw(cLine.pb.y)
        )
    }

    if (prevX) {
        stroke(150);
        line(nptw(prevX), nptw(prevY), mouseX, mouseY);
    }

    noStroke();
    fill(0,255,0);
    ellipse(nptw(spawnPointX), nptw(spawnPointY), 15, 15);

    stroke(200,255,200);
    line(nptw(-1), nptw(-1), nptw( 1), nptw(-1));
    line(nptw( 1), nptw(-1), nptw( 1), nptw( 1));
    line(nptw( 1), nptw( 1), nptw(-1), nptw( 1));
    line(nptw(-1), nptw( 1), nptw(-1), nptw(-1));

    noStroke();
    fill(255);
    textSize(20);
    text(`
        F:    Finish line
        C:    Cancel line
        S:    Set Spawnpoint
        D:    Download course
        L:    Load course
        R:    Reset
        B:    Back to NeuralCars
        M:    Run in neuralCars
    `, windowWidth - 270, 10);
}

function windowResized() {
    createCanvas(windowWidth, windowHeight);
    minSide = Math.min(windowWidth, windowHeight);
}

const nptw = val => map(val, -1, 1, 0, minSide); // stands for normal-plane to window.
const wtnp = val => map(val, 0, minSide, -1, 1); // stands for window to normal-plane.

function mousePressed() {
    const nmx = wtnp(mouseX);
    const nmy = wtnp(mouseY);

    if (prevX) {
        walls.push({pa: {x: prevX, y: prevY}, pb: {x: nmx, y: nmy}});
    }

    prevX = nmx;
    prevY = nmy;

    if (!startedX) {
        startedX = prevX;
        startedY = prevY;
    }
}

function keyPressed() {
    switch (key) {
        case "s": {
            spawnPointX = wtnp(mouseX);
            spawnPointY = wtnp(mouseY);
            break;
        }
        case "f": {
            walls.push({pa: {x: prevX, y: prevY}, pb: {x: startedX, y: startedY}});
            prevX = prevY = startedX = startedY = undefined;
            break;
        }
        case "c": {
            prevX = prevY = startedX = startedY = undefined;
            break;
        }
        case "d": {
            const element = document.createElement("a");
            element.setAttribute("href",
            `data:text/plain;charset=utf-8,${JSON.stringify({startX: spawnPointX, startY: spawnPointY, walls})}`);
            element.setAttribute("download", "course.json");
            element.click();
            break;
        }
        case "l": {
            const fileReaderButton = document.getElementById("fileReader");
            fileReaderButton.click();
            fileReaderButton.addEventListener("change", event => {
                const fileReader = new FileReader();

                fileReader.onload = evt => {
                    const course = JSON.parse(evt.target.result);
                    spawnPointX = course.startX;
                    spawnPointY = course.startY;
                    walls = course.walls;

                    fileReaderButton.remove();
                    const newFileReaderButton = document.createElement("input");
                    newFileReaderButton.type = "file";
                    newFileReaderButton.id = "fileReader";
                    newFileReaderButton.style.display = "none";
                    document.body.prepend(newFileReaderButton);
                };

                fileReader.readAsText(fileReaderButton.files[0], "UTF-8");
            });
            break;
        }
        case "r": {
            prevX = prevY = startedX = startedY = spawnPointX = spawnPointY = undefined;
            walls.length = 0;
            break;
        }
        case "b": {
            const url = window.location.href;
            window.location.href = url.substring(0, url.lastIndexOf("creator"));
            break;
        }
        case "m": {
            sessionStorage.setItem("neuralCarsCreator-customCourse",JSON.stringify({startX: spawnPointX, startY: spawnPointY, walls}))
            const url = window.location.href;
            window.location.href = url.substring(0, url.lastIndexOf("creator")) + "?load_custom_course";
            break;
        }
    }   
}