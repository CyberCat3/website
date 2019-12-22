const CELLS_HORIZONTAL = 20;
const CELLS_VERTICAL = 12;
const CELL_SIZE = 50;
const WINDOW_WIDTH = CELLS_HORIZONTAL * CELL_SIZE;
const WINDOW_HEIGHT = CELLS_VERTICAL * CELL_SIZE;
const IMPORTANT_FRAME = 8;
const PIXELS_PER_FRAME = CELL_SIZE / IMPORTANT_FRAME;

var isDead = false;
var isPaused = false;

console.log("CELLS_HORIZONTAL", CELLS_HORIZONTAL);
console.log("CELLS_VERTICAL", CELLS_VERTICAL);
console.log("CELL_SIZE", CELL_SIZE);
console.log("WINDOW_WIDTH", WINDOW_WIDTH);
console.log("WINDOW_HEIGHT", WINDOW_HEIGHT);

var keyQueue = new Queue(4);

var snake;

var score = 0;

var jaibelImg;
var appleImg;

let food;
function findNewFoodSpot() {
	do {
		food = {
			x: Math.floor(Math.random() * (CELLS_HORIZONTAL - 2)) + 1,
			y: Math.floor(Math.random() * (CELLS_VERTICAL - 2)) + 1
		};
	} while (snakeBodyOnFood());
}

function funkyText(input, align, size, r, g, b) {
	if (!size) { size = 45; }
	if (!align) { align = CENTER; }
	if (!r) { r = 255; }
	if (!g && !b) { g = b = r; }
	textAlign(align);
	textSize(size);
	fill(0);
	noStroke();
	text(input, WINDOW_WIDTH / 2 + 2, WINDOW_HEIGHT / 2 + 2);
	fill(r,g,b);
	text(input, WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);
}

function snakeBodyOnFood() {
	for (let part of snake.body) {
		if (part.x == food.x && part.y == food.y) {
			return true;
		}
	}
	return false;
}

function preload() {
	let loadingHeader = document.getElementById("loadingHeader");
	loadingHeader.innerText = "Loading jaibel...";
	jaibelImg = loadImage("../../image/Jaibel.png");
	setInterval(() => loadingHeader.innerText = "Loading apple...", 400);
	appleImg = loadImage("../../image/apple.png");
}

function setup() {
	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
	
	//frameRate(12);
	snake = new Snake();
	findNewFoodSpot();
}

var transitionOffset = 0;
var frameIndex = 0;
function draw() {
	if (++frameIndex >= IMPORTANT_FRAME) {
		frameIndex = 0;
		snake.update();
		
		if (isPaused) {
			noLoop();
			keyQueue = new Queue(4);
			setTimeout(() => funkyText("Pause", CENTER, null, 41, 128, 185), 0);
		}
		
		if (keyQueue.elementsLeft > 0) {
			let key = keyQueue.deque();
			
			switch (key) {
				case "w": case "ArrowUp":    snake.changeDir(0); break;
				case "d": case "ArrowRight": snake.changeDir(1); break;
				case "s": case "ArrowDown":  snake.changeDir(2); break;
				case "a": case "ArrowLeft":  snake.changeDir(3); break;
			}
		}
		
		if (snake.head.x == food.x && snake.head.y == food.y) {
			snake.grow();
			findNewFoodSpot();
		}
		
		score = (snake.body.length - 4) * 10;
	}
	
	transitionOffset = PIXELS_PER_FRAME * (frameIndex + 1);	
	background(30);
	
	imageMode(CORNER);
	image(appleImg, food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE * 0.9, CELL_SIZE * 0.9);
	
	snake.draw();
	
	if (isDead) {
		noLoop();
		funkyText("Du døede, tryk \"mellemrum\" for at prøve igen.", CENTER, 48, 231, 76, 60);
	}

	textAlign(LEFT);
	textSize(48);
	noStroke();
	fill(0);
	text("Score: " + score, 12, 50);
	fill(46, 204, 113);
	text("Score: " + score, 10, 48);
}

function keyPressed() {
	if (isPaused) {
		switch (key) {
			case "p":
			case "w": case "a": case "s": case "d":
			case "ArrowUp":		case "ArrowLeft":
			case "ArrowDown":	case "ArrowRight":
			isPaused = false;
			loop();
			break;
		}
	} else if (key === "p" && !isDead) {
		isPaused = true;
	}
	if (key === " ") {
		if (isDead) {
			isDead = false;
			snake.body = [];
			for (let i = 0; i < 4; ++i) {
				snake.grow();
			}
			snake.dir = 1;
			keyQueue = new Queue();
			loop();
		}
	} else {
		keyQueue.queue(key);
	}
}

console.log("game.js loaded");