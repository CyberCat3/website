let obstacleImages;
let obstacleTypes;
function setupObstacles() {
    obstacleImages = {
        cactus: smartImageLoad("assets/obstacles/cactus.png"),
        tumbleweed: smartImageLoad("assets/obstacles/tumbleweed.png"),
        palmtree: smartImageLoad("assets/obstacles/palmtree.png")
    }
    obstacleTypes = Object.keys(obstacleImages);
    // obstacleImages.push({name: "cactus", img: loadImage("assets/obstacles/cactus.png")});
    // obstacleImages.push({name: "tumbleweed", img: loadImage("assets/obstacles/tumbleweed.png")});
}

class Obstacle {
    constructor(jaibel, type, onOutOfScreen, onCollide) {
        if (!type) {
            type = obstacleTypes[parseInt(obstacleTypes.length * Math.random())];
        }
        this.type = type;
        this.img = obstacleImages[type];
        if (this.type === "tumbleweed") {
            this.dir = 0;
        }
        this.velocityMultiplier =
            this.type === "tumbleweed" ? 1.1 : 1;

        this.width = this.img.width;
        this.height = this.img.height;
        this.x = WIDTH + this.width / 2;
        this.jaibel = jaibel;
        this.onCollide = onCollide;
        this.onOutOfScreen = onOutOfScreen;
    }

    update() {
        this.x -= (9 + score * 0.05) * this.velocityMultiplier;
        if (this.x < -this.width / 2) {
            this.onOutOfScreen();
            return;
        }
        this.dir -= 0.1;
        
        // Test collide here
        let collideWidth = this.jaibel.width * 0.4; // The collide width used for jaibel.
        let jb = { // jb for JaibelBounds
            x: this.jaibel.x - collideWidth / 2 + 5,
            y: this.jaibel.y - this.jaibel.height / 2 - 15,
            w: collideWidth,
            h: this.jaibel.height - 15
        }
        if (this.type === "tumbleweed") {
            if (
                collideRectCircle(jb.x, jb.y, jb.w, jb.h, // Jaibel bounds
                this.x,                                 // tumbleweed x
                GAME_LINE + sin(this.dir) * 20 + 20,    // tumbleweed y
                this.width * 0.9                        // tumbleweed radius
            )) {                                        
                this.onCollide();
            }
        } else if (this.type === "cactus") {
            let collideWidth = this.width * 0.65;
            let collideHeight = this.height * 0.7;
            if (
                collideRectRect(jb.x, jb.y, jb.w, jb.h, // Jaibel bounds
                this.x - collideWidth / 2, // Cactus x
                GAME_LINE - collideHeight / 2 + 23, // Cactus y
                collideWidth, collideHeight
            )) { // Cactus width and height
                this.onCollide();
            }
        } else if (this.type === "palmtree") {
            let collideWidth = this.width * 0.4;
            let collideHeight = this.height * 0.6;
            if (
                collideRectRect(jb.x, jb.y, jb.w, jb.h, // Jaibel bounds
                this.x - collideWidth / 2,              // Palmtree x
                GAME_LINE / 1.05 - collideHeight / 2,   // Palmtree y
                collideWidth, collideHeight
            )) {                                        // Palmtree width and height
                this.onCollide();
            }
        }        
    }

    draw() {
        imageMode(CENTER);
        if (this.type === "tumbleweed") {
            let offsetY = sin(this.dir) * 20 + 20;
            push();
            translate(this.x, GAME_LINE + offsetY);
            rotate(this.dir);
            image(this.img, 0, 0, this.width, this.height);
            if (showHitbox) {
                fill(TRANSPARENT_RED);
                circle(0,0,this.width * 0.9);
            }
            pop();

        } else if (this.type === "cactus") {
            image(this.img, this.x, GAME_LINE, this.width, this.height);
            if (showHitbox) {
                let collideWidth = this.width * 0.65;
                let collideHeight = this.height * 0.7;
                fill(TRANSPARENT_RED);
                rect(this.x - collideWidth / 2, GAME_LINE - collideHeight / 2 + 23, collideWidth, collideHeight);
            }
        } else if (this.type === "palmtree") {  
            image(this.img, this.x, GAME_LINE / 1.05, this.width * 0.8, this.height * 0.75);
            if (showHitbox) {
                let collideWidth = this.width * 0.36;
                let collideHeight = this.height * 0.59;
                fill(TRANSPARENT_RED);
                rect(this.x - collideWidth / 2, GAME_LINE / 1.05 - collideHeight / 2, collideWidth, collideHeight);
            }
        }
    }
}

console.log("obstacles.js loaded");