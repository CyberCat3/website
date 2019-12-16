let treeImage;

const TREE_WIDTH = 100;
const TREE_HITBOX_WIDTH = TREE_WIDTH / 5;

// From StackOverflow posted by markE on Jan 13 2014 at 16.21	
function rectCircleColliding(circleX, circleY, circleRadius, rectX, rectY, rectW, rectH){
    var distX = Math.abs(circleX - rectX-rectW/2);
    var distY = Math.abs(circleY - rectY-rectH/2);

    if (distX > (rectW/2 + circleRadius)) { return false; }
    if (distY > (rectH/2 + circleRadius)) { return false; }

    if (distX <= (rectW/2)) { return true; } 
    if (distY <= (rectH/2)) { return true; }

    var dx=distX-rectW/2;
    var dy=distY-rectH/2;
    return (dx*dx+dy*dy<=(circleRadius*circleRadius));
}	

function setupTree() {
	treeImage = loadImage("images/juletrae.png");
	console.log("loaded tree image");
}

class Tree {
	constructor(spot) {
		this.spot = spot;
		this.x = WIDTH + 50;
	}

	update() {
		this.x -= 3.5 + score / 300;
		if (this.x < -50) {
			return false;
		}
		return true;
	}

	collidesWithJaibel(jaibel) {
		let collidesTop = rectCircleColliding(JAIBEL_X_OFFSET, jaibel.y, JAIBEL_HITBOX_SIZE,
			this.x - TREE_HITBOX_WIDTH / 2, 0, TREE_HITBOX_WIDTH, this.spot - 120);
		let collidesBottom = rectCircleColliding(JAIBEL_X_OFFSET, jaibel.y, JAIBEL_HITBOX_SIZE,
			this.x - TREE_HITBOX_WIDTH / 2, this.spot + 120, TREE_HITBOX_WIDTH, HEIGHT);
		return collidesTop || collidesBottom;
	}

	draw() {
		imageMode(CENTER);
		push();
		translate(this.x, this.spot);
		image(treeImage, 0, 325, TREE_WIDTH, 500);
		rotate(PI);
		image(treeImage, 0, 325, TREE_WIDTH, 500);
		pop();

		if (this.letter) {
			textAlign(CENTER);
			fill(0);
			text(this.letter, this.x + 2, this.spot + 2);
			fill(255);
			text(this.letter, this.x, this.spot);
		}
		//rect(this.x - TREE_HITBOX_WIDTH / 2, 0, TREE_HITBOX_WIDTH, this.spot - 100);
		//rect(this.x - TREE_HITBOX_WIDTH / 2, this.spot + 100, TREE_HITBOX_WIDTH, HEIGHT);
	}
}

console.log("tree.js loaded");