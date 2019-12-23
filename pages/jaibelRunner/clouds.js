let cloudImages = [];
function setupClouds() {
    for (let i = 1; i <= 3; ++i) {
        cloudImages.push(smartImageLoad(`assets/clouds/cloud${i == 1 ? "" : i}.png`));
    }
}

class Cloud {
    constructor(onOutOffScreen) {
        this.onOutOffScreen = onOutOffScreen;
        this.size = random(0.2, 1.5);
        this.image = cloudImages[int(random(0, cloudImages.length))];
        this.width = this.image.width / 7 * this.size;
        this.height = this.image.height / 7 * this.size;
        this.x = WIDTH + this.width / 2;
        this.y = random(this.height / 2, HORIZON_LINE - this.height / 2);
    }

    update() {
        this.x -= this.size;
        if (this.x < -50) {
            this.onOutOffScreen();
            return;
        }
    }

    draw() {
        imageMode(CENTER);
        image(this.image, this.x, this.y, this.width, this.height);
    }
}

console.log("clouds.js loaded");