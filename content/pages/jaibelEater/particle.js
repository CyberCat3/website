let particles = [];
let jWidth;
let jHeight;







class Particle {
	constructor(dir, pos) {
		this.pos = createVector(pos.x, pos.y);
		this.vel = createVector(1,0);
		this.vel.setMag(random(3,5));
		this.dir = dir - 20 + random(40);
		this.vel.rotate(radians(this.dir));
		this.jaibel = floor(random(5));
		particles.push(this);
	}

	static update() {
		particles.forEach(function (s) {
			s.pos.add(s.vel);
			if (s.pos.x < 0 ||
				s.pos.x > w ||
				s.pos.y < 0 ||
				s.pos.y > w)
				particles.splice(particles.indexOf(s), 1);
		});
	}
	static draw() {
		fill(255);
		noStroke();
		particles.forEach(function (s) {
			s.dir += s.vel.magSq();
			if(s.dir > 360) s.dir = 0;


			/*push();
			translate(s.pos.x, s.pos.y);
			rotate(radians(s.dir));
			
			imageMode(CENTER);
			
			pop();*/
			push();
			translate(s.pos.x, s.pos.y);
			rotate(radians(s.dir));
			imageMode(CENTER);
			image(jaibelFrames[s.jaibel], 0, 0, s.vel.magSq() * 2, s.vel.magSq() * 2);
			pop();
			//ellipse(s.pos.x, s.pos.y, s.vel.magSq(), s.vel.magSq());
		});
	}
}