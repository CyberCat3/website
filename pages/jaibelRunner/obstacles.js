let obstacleImages = [];
function setupObstacles() {
    obstacleImages.push(loadImage("assets/obstacles/cactus.png"));
    obstacleImages.push(loadImage("assets/obstacles/tumbleweed.png"));
}

class Obstacle {
    constructor(collide, onOutOfScreen) {
        this.img = obstacleImages[int(random(0, obstacleImages.length))];
        this.width = this.img.width;
        this.height = this.img.height;
        this.x = WIDTH + this.width / 2;
        this.collide = collide;
        this.onOutOfScreen = onOutOfScreen;
    }

    update() {
        this.x -= 9;
        if (this.x < -this.width / 2) {
            this.onOutOfScreen();
            return;
        }
        this.collide();
    }

    draw() {
        imageMode(CENTER);
        image(this.img, this.x, GAME_LINE, this.width, this.height);
    }
}

console.log("obstacles.js loaded");