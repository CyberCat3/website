const WIDTH = 1000;
const HEIGHT = 600;
let gameMode = "standard";
let score = 0;
let fails = 0;

let trygveCodeStack;
let simonCodeStack;

let codeHeader;

function queryParametersToObject(query) {
	let objectToBeReturned = {};

	let queries = query.split("&");
	for (let queryParameter of queries) {
		let parts = queryParameter.split("=");
		objectToBeReturned[parts[0]] = parts[1];
	}

	return objectToBeReturned;
}

window.onload = () => {
    let header = document.getElementById("titleHeader");
    let button = document.getElementById("backButton");
	button.style = "float: left; margin-right: 10px; width: 80px; height: " + header.clientHeight + "px;";
	console.log(button.style);
}

function preload() {
	let loadingHeader = document.getElementById("loadingHeader");
	loadingHeader.innerText = "Loading snowflakes...";
    setupSnowFlakes();
	setTimeout(() => loadingHeader.innerText = "Loading Jaibel...", 500);
    setupJaibel();
   	setTimeout(() => loadingHeader.innerText = "Loading trees...", 700);
    setupTree();
}

function setup() {
    createCanvas(WIDTH, HEIGHT).parent("canvasHolder");
    frameRate(60);
    reset();
}

function mousePressed() {
	jaibel.jump();
	if (isDead) {
		reset();
		loop();
	}
}

function keyPressed() {
	if (key === " ") {
		jaibel.jump();
		if (isDead) {
			reset();
			loop();
		}
	}
}

function died() {
	++fails;
	score = 0;
	setTimeout(() => isDead = true, 200);
	noLoop();
	textAlign(CENTER);
	textSize(45);
	fill(0);
	text("Du døede, tryk \"mellemrum\" for at prøve igen.", WIDTH / 2 + 2, HEIGHT / 2 + 2);
	fill(255);
	text("Du døede, tryk \"mellemrum\" for at prøve igen.", WIDTH / 2, HEIGHT / 2);
}

let isDead;
let treeFrame;
let trees;
let jaibel;

function reset() {

	let queryParameters = queryParametersToObject(document.location.href.substring(document.location.href.indexOf("?") + 1));

	let header = document.getElementById("titleHeader");

	if (queryParameters.mode === "trygve") {
		header.textContent = "FlappyJaibel - Trygve edition";
		codeHeader = document.getElementById("steamCode");
		codeHeader.textContent = "Kode:";
		gameMode = "trygve";
	} else if (queryParameters.mode === "simon") {
		header.textContent = "FlappyJaibel - Simon edition";
		codeHeader = document.getElementById("steamCode");
		codeHeader.textContent = "Kode:";
		gameMode = "simon";
	}

	console.log("Gamemode is: " + gameMode);



	isDead = false;
	treeFrame = 0;
	trees = new Set();
	trygveCodeStack = "A23DE-512FG-GGG21".split("").reverse();
        simonCodeStack = "91BCE-GGG21-512FG".split("").reverse();
	jaibel = new FlappyJaibel();
}

function limit(x, y) {
	if (x > y) {
		return y;
	}
	return x;
}

function draw() {
	let dieThisFrame = false;
	if (treeFrame-- <= 0) {
		if (gameMode === "trygve" ||gameMode === "simon") {
			treeFrame = 80 + floor(fails * 2 + random(0, 60)) - limit(score / 35, 70);
		} else {
			treeFrame = 80 + floor(random(0, 60));
		}
		let tree = new Tree(random(110, HEIGHT - 110));
		
		if (gameMode === "trygve" || gameMode === "simon") {
			tree.letter = gameMode === "trygve" ? trygveCodeStack.pop() : gameMode === "simon" ? simonCodeStack.pop() : undefined;
			if (tree.letter) {
				trees.add(tree);
			}
		} else {
			trees.add(tree);
		}


	}
	jaibel.update();

	if (jaibel.y < -75 || jaibel.y > HEIGHT + 75) {
		dieThisFrame = true;
	}

	background(150,200,255);
	jaibel.draw();
	for (let tree of trees) {
		if (!tree.update()) {
			trees.delete(tree);
			if (tree.letter) {
				if (codeHeader.textContent.endsWith(":")) {
					codeHeader.textContent += " " + tree.letter;
				} else {
					codeHeader.textContent += tree.letter;
				}
				if ((gameMode === "simon" || gameMode === "trygve") && trees.size === 0) {
					setTimeout(() => {
						noLoop();
						setTimeout(() => {
							push();
							textAlign(CENTER);
							textSize(80);
							translate(WIDTH / 2, HEIGHT / 2);
							rotate(radians(20));
							fill(0);
							text("Tillykke!", 2, 2);
							fill(255);
							text("Tillykke!", 0, 0);
							console.log("made won text");
							pop();
						}, 100);
					}, 500);
				}
			}
			score += 10;
		}
		if (tree.collidesWithJaibel(jaibel)) {
			dieThisFrame = true;
		}
		tree.draw();
	}
	drawSnowFlakes();
	textSize(30);
	textAlign(LEFT);
	fill(0);
	text("Score: " + score, 5, 32);
	if (gameMode === "trygve" || gameMode === "simon") {
		text("Fejl: " + fails, 5, 67);
	}
	fill(255);
	text("Score: " + score, 3, 30);
	if (gameMode === "trygve" || gameMode === "simon") {
		text("Fejl: " + fails, 3, 65);
	}
	if (dieThisFrame) {
		died();
	}
}

console.log("flappyJaibel.js loaded");
