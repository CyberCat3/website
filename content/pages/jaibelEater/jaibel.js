class Jaibel {
	constructor(x, y, moveKeys, abillityKey) {
		this.pos = createVector(x,y);
		this.vel = createVector(0.1,0.1);
		this.frame = 0;
		this.loopDir = true;
		this.moveKeys = moveKeys;
		this.abillityKey = abillityKey;
		this.isColliding = false;
		this.newFrame = 0;
		this.lowFrameIndex = 0;
		this.frameSpeed = 6;
		this.shake = 0;
		this.percentSize = 100;
		this.highFrameIndex = 5;

		this.eatState = 0;
	}

	static collide(jai1, jai2) {
		if (dist(jai1.pos.x, jai1.pos.y, jai2.pos.x, jai2.pos.y) < 80) {

			
			if (!this.isColliding) {
				let jai1force =jai1.vel.mag();
				let jai2force = jai2.vel.mag();
				console.log("jai1force: " + jai1force);
				console.log("jai2force: " + jai2force);
				console.log("dir bf col jai1: " + jai1.dir);
				console.log("dir bf col jai2: " + jai2.dir);

				jai1.lookAt(jai2.pos);
				jai2.lookAt(jai1.pos);

				jai1.dir += 180;
				jai2.dir += 180;

				console.log("dir af col jai1: " + jai1.dir);
				console.log("dir af col jai2: " + jai2.dir);


				jai1.vel.rotate(radians(jai1.dir - degrees(jai1.vel.heading())));
				jai2.vel.rotate(radians(jai2.dir - degrees(jai2.vel.heading())));

				jai1.vel.setMag(jai2force);
				jai2.vel.setMag(jai1force);


				this.isColliding = true;
			}
			
		} else this.isColliding = false;
	}

	lookAt(pos) {
		this.dir = degrees(atan2(pos.y - this.pos.y, pos.x - this.pos.x));
	}


	update() {
		let addidant = 1;
		let count = 0;

		let moveKeys = this.moveKeys;
		for (let i = 0; i < moveKeys.length; ++i)
			if (keysPressed[moveKeys[i]]) ++count;

		if (count >= 2) addidant = 0.7;

		if (keysPressed[moveKeys[1]]) {
			this.vel.x -= addidant;
		}
		if (keysPressed[moveKeys[3]]) {
			this.vel.x += addidant;
		}
		if (keysPressed[moveKeys[0]]) {
			this.vel.y -= addidant;
		}
		if (keysPressed[moveKeys[2]]) {
			this.vel.y += addidant;
		}

		if (keysPressed[this.abillityKey]) {
			this.highFrameIndex = 1;
			this.frameSpeed = 4;
			new Particle(this.dir, this.pos);
		} else {
			this.highFrameIndex = 5;
			this.frameSpeed = 6;
		}

		/*
		if (keysPressed[this.abillityKey]) {
			let frameIndex = (this.eatState > 100) ? 5 : 5 - floor((this.eatState) / 20);
			this.lowFrameIndex  = frameIndex;
			this.highFrameIndex = frameIndex;
			if (this.eatState < 100)
				++this.eatState;


		} else {

			if (this.eatState >= 100 && this.eatState < 200) {

				this.frameSpeed = 1;
				this.eatState = 101;


			

			} else {
			
				if (this.eatState > 0) {

					--this.eatState;
				}

			}

		}

		

		

		let visualModifer = this.eatState <= 100 ? this.eatState : 100;
		this.shake = visualModifer / 15;
		this.percentSize = 100 + visualModifer * 2.5;

		if (this.eatState == 101) {
			this.frameSpeed = 1;
			this.lowFrameIndex = 5;
			this.highFrameIndex = 5;
			if (this.frame == 5) {
				this.lowFrameIndex = 0;
				this.eatState = 200;
			}
		}

		if (this.eatState >= 200) {
			console.log("this.eatState >= 200");
			console.log("this.percentSize bf: " + this.percentSize);
			this.percentSize = 100 + (5 - (this.eatState - 200)) * 20;
			console.log("this.percentSize af: " + this.percentSize);
			if (this.percentSize == 100) {
				this.lowFrameIndex = 0;
				this.highFrameIndex = 5;
				this.frameSpeed = 6;
				this.eatState = 0;
				console.log("this.eatState was >= 200 percentSize was 100 eatState is now 0");
				console.log("this.eatState: " + this.eatState);
			}
		} 
		*/
			
			

		this.pos.add(this.vel); 

		if 		(this.pos.x < 0) {	this.pos.x = 0;		this.vel.x = -this.vel.x;	}
		else if (this.pos.x > w) {	this.pos.x = w;		this.vel.x = -this.vel.x;	}
		if 		(this.pos.y < 0) {	this.pos.y = 0;		this.vel.y = -this.vel.y;	}
		else if (this.pos.y > h) {	this.pos.y = h;		this.vel.y = -this.vel.y;	}

		this.vel.mult(airDragMultiplier);

		this.dir = degrees(this.vel.heading());
	}

	

	show() {


		fill(255);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(radians(this.dir - this.shake + 2 * random(this.shake)));
		if (this.dir < -90 || this.dir > 90)
			scale(this.percentSize / 100, -this.percentSize / 100);
		else
			scale(this.percentSize / 100, this.percentSize / 100);
		
		imageMode(CENTER);

		image(jaibelFrames[this.frame], 0, 0, jaibelFrames[this.frame].width / 3, jaibelFrames[this.frame].height / 3);
		pop();



		++this.newFrame;
		if (this.newFrame >= this.frameSpeed) {
			this.newFrame = 0;
			if (!(this.frame == this.highFrameIndex && this.frame == this.lowFrameIndex)) {

				if (this.frame >= this.highFrameIndex) this.loopDir = false;
				else if (this.frame <= this.lowFrameIndex) this.loopDir = true;
				if (this.loopDir) ++this.frame;
				else --this.frame;
			}
		}
	}
}