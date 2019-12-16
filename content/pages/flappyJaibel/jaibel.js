let jaibelImage;
const JAIBEL_SIZE = 80;
const JAIBEL_HITBOX_SIZE = JAIBEL_SIZE * 0.7;
const JAIBEL_X_OFFSET = 100;

function setupJaibel() {
	jaibelImage = loadImage("../../image/Jaibel.png");
	console.log("Loaded jaibel image");	
}

class FlappyJaibel {
	constructor() {
		this.y = HEIGHT / 3;
		this.yVel = 0;
	}

	jump() {
		if (this.yVel > -3) {
			this.yVel = -3;
		} 
		this.yVel -= 3;
	}

	update() {
		this.yVel += 0.2;
		this.y += this.yVel;
	}

	draw() {
		imageMode(CENTER);
		push();
		translate(100, this.y);
		rotate(map(this.yVel, -10, 10, -HALF_PI, HALF_PI));
		image(jaibelImage, 0, 0, JAIBEL_SIZE, JAIBEL_SIZE);
		pop();
		noStroke();
		fill(0,0,255);
		//ellipse(JAIBEL_X_OFFSET, this.y, JAIBEL_SIZE, JAIBEL_SIZE);
		fill(255,0,0);
		//ellipse(JAIBEL_X_OFFSET, this.y, JAIBEL_HITBOX_SIZE, JAIBEL_HITBOX_SIZE);
	}
}

console.log("jaibel.js loaded");