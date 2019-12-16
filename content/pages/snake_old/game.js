let width = 1000;
let height = 600;
let size = 50;
let w;
let h;
let snake;
let food;
const INITIAL_SNAKE_LENGTH = 3;

function setup() {
	createCanvas(width,height);
	snake = new Snake(size);
	for (let i = 0; i < INITIAL_SNAKE_LENGTH - 1; ++i) {
		snake.grow();
	}
	w = floor(width / size);
	h = floor(height / size);
	foodLocation();
}

function foodLocation() {
	let x = floor(random(w));
	let y = floor(random(h));
	food = createVector(x,y);
}

function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW: snake.setDir(-1,0); break; 
		case RIGHT_ARROW: snake.setDir(1,0); break;
		case UP_ARROW: snake.setDir(0,-1); break;
		case DOWN_ARROW: snake.setDir(0,1); break;
	}
}

function mousePressed() {
	snake.grow();
}

function draw() {
	frameRate(10);
	background(220);
	if (snake.eat(food)) {
		foodLocation();
	}
	noStroke();
	fill(255,0,0);
	rect(food.x*size, food.y*size, size, size);
	snake.update();
	snake.show();

	if (snake.endGame()) {
		print("END GAME");
		background(180);
		noLoop();
	}
}