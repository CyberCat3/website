const WIDTH = 1000;
const HEIGHT = 600;
let score = 0;
let fails = 0;

let isDead;
let treeFrame;
let trees;
let jaibel;

let queryParameters;
let header;
let codeHeader;

let giftMap = {
	      "trygve": { kode: "TRYGV-EFALS-KKODE", titel: "FlappyJaibel - Trygve Edition - Fra Andreas"                       },
	       "simon": { kode: "SIMON-FALSK-KODEX", titel: "FlappyJaibel - Simon Edition - Fra Andreas"                        },
	       "asger": { kode: "ASGER-FALSK-KODEX", titel: "FlappyJaibel - Asger edition - Fra Anne, Thomas, Trygve & Andreas" },
	"trygve-ellen": { kode: "TRYGV-EMORM-ORGAV", titel: "FlappyJaibel - Trygve Edition - Fra Ellen"                         }
};

let gift = false;

function queryParametersToObject(query) {
	let objectToBeReturned = {};

	let queries = query.split("&");
	for (let queryParameter of queries) {
		let parts = queryParameter.split("=");
		objectToBeReturned[parts[0]] = parts[1];
	}

	return objectToBeReturned;
}

function reset() {
	if (equalsAny(queryParameters.mode, ["trygve", "simon", "asger", "trygve-ellen"])) {
		gift = giftMap[queryParameters.mode];
		gift.codeStack = gift.kode.split("").reverse();
		header.textContent = gift.titel;
		codeHeader.textContent = "Kode:";
	}

	console.log("GiftMode: " + JSON.stringify(gift));

	isDead = false;
	treeFrame = 0;
	trees = new Set();
	jaibel = new FlappyJaibel();
}

window.onload = () => {
    let header = document.getElementById("titleHeader");
    let button = document.getElementById("backButton");
	button.style = "float: left; margin-right: 10px; width: 80px; height: " + header.clientHeight + "px;";
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
	queryParameters = queryParametersToObject(document.location.href.substring(document.location.href.indexOf("?") + 1));
	header = document.getElementById("titleHeader");
	codeHeader = document.getElementById("steamCode");
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

function limit(x, y) {
	if (x > y) {
		return y;
	}
	return x;
}

function equalsAny(object, others) {
	for (let other of others) {
		if (object === other) {
			return true;
		}
	}
	return false;
}

function draw() {
	let dieThisFrame = false;
	if (treeFrame-- <= 0) {
		if (gift) {
			treeFrame = 80 + floor(fails * 2 + random(0, 60)) - limit(score / 35, 70);
		} else {
			treeFrame = 80 + floor(random(0, 60));
		}
		let tree = new Tree(random(110, HEIGHT - 110));
		
		if (gift) {
			tree.letter = gift.codeStack.pop();
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
				if (gift && trees.size === 0) {
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
	if (gift) {
		text("Fejl: " + fails, 5, 67);
	}
	fill(255);
	text("Score: " + score, 3, 30);
	if (gift) {
		text("Fejl: " + fails, 3, 65);
	}
	if (dieThisFrame) {
		died();
	}
}

console.log("flappyJaibel.js loaded");
