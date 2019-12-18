let obstacleImages = [];
function setupObstacles() {
    obstacleImages.push({name: "cactus", img: loadImage("assets/obstacles/cactus.png")});
    obstacleImages.push({name: "tumbleweed", img: loadImage("assets/obstacles/tumbleweed.png")});
}

class Obstacle {
    constructor(jaibel, onOutOfScreen, onCollide) {
        this.img = obstacleImages[int(random(0, obstacleImages.length))];
        this.type = this.img.name;
        this.img = this.img.img;
        if (this.type === "tumbleweed") {
            this.dir = 0;
        }
        this.width = this.img.width;
        this.height = this.img.height;
        this.x = WIDTH + this.width / 2;
        this.jaibel = jaibel;
        this.onCollide = onCollide;
        this.onOutOfScreen = onOutOfScreen;
    }

    update() {
        this.x -= 9;
        if (this.x < -this.width / 2) {
            this.onOutOfScreen();
            return;
        }
        this.dir -= 0.1;

        // Test collide here
        

    }

    draw() {
        imageMode(CENTER);
        push();
        translate(this.x, GAME_LINE);
        if (this.type === "tumbleweed") {
            translate(0, sin(this.dir) * 20 + 20);
            rotate(this.dir);
        }
        image(this.img, 0, 0, this.width, this.height);
        pop();
    }
}

console.log("obstacles.js loaded");