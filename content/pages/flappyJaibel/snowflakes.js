let snowFlakeImages = [];
function setupSnowFlakes() {
	snowFlakeImages.push(loadImage("images/Snefnug1.png"));
	snowFlakeImages.push(loadImage("images/Snefnug2.png"));
	snowFlakeImages.push(loadImage("images/Snefnug3.png"));
	snowFlakeImages.push(loadImage("images/Snefnug4.png"));
	snowFlakeImages.push(loadImage("images/Snefnug5.png"));
	console.log("loaded snowflake images");
}

let snowFlakes = new Set();


let importantFrame = 0;
function drawSnowFlakes() {
	if (++importantFrame > 8) {
		importantFrame = 0;
		snowFlakes.add({x: random(200, WIDTH + 600), y: 0, velX: random(2.2, 2.5), velY: random(1, 1.7), image: Math.floor(Math.random() * (snowFlakeImages.length))});
	}
	for (let snowFlake of snowFlakes) {
		snowFlake.y += snowFlake.velY;
		snowFlake.x -= snowFlake.velX;

		imageMode(CENTER);
		image(snowFlakeImages[snowFlake.image], snowFlake.x, snowFlake.y, 10, 10);

		if (snowFlake.y > HEIGHT) {
			snowFlakes.delete(snowFlake);
		}
	}
}

console.log("snowflakes.js loaded");
