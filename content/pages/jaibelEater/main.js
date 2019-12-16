let jaibels;
let w = 1280;
let h = 720;
let keysPressed; 
let jaibelFrames;
let bulletImage;
let isJaibelWorld = false;
let airDragMultiplier = 0.95;

function jaibelWorld() {

	if (isJaibelWorld) {
		for (let i = 0; i < 7; ++i) jaibels.pop();
		airDragMultiplier = 0.95;
		isJaibelWorld = false;

	} else {
		for (let i = 0; i < 7; ++i) {
			let jaibel = new Jaibel(random(w), random(h), []);
			jaibel.vel = createVector(random(10), random(10));
			jaibels.push(jaibel);
		}
		airDragMultiplier = 1;
		isJaibelWorld = true;

	}	

	
}

function setup() {
	createCanvas(w, h);



	jaibels = [
		new Jaibel(w / 3, h / 2, ['w', 'a', 's', 'd'], ' '),
		new Jaibel(w - w / 3, h / 2, ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"], "l"),
		new Jaibel(w / 2, h / 2, [])
	];


	keysPressed = {};
	jaibelFrames = [];
	bulletImage = loadImage("bullet.png");
	for (let i = 1; i <= 6; ++i)
		jaibelFrames.push(loadImage("jaibelFrames/" + i + ".png"));

	jWidth = jaibelFrames[0].width;
	Height = jaibelFrames[0].height;

}

function draw() {
	background(51);
	jaibels.forEach(function (s) {
		s.update();
		s.show();
	})

	Particle.update();
	Particle.draw();

	for (let i = 0; i < jaibels.length - 1; ++i)
 		for (let j = i + 1; j < jaibels.length; ++j)
			Jaibel.collide(jaibels[i], jaibels[j]);
	//for (let i = 0; i < jaibels.length; ++i)
	//	for (let j = 0; j < jaibels.length; ++j)
	//		if (i != j)
    //			jaibels[i].collide(jaibels[j]);
		
		
	
}

function keyPressed() {
	keysPressed[key] = true;
}

function keyReleased() {
	keysPressed[key] = false;
}