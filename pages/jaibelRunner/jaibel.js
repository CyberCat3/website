let jaiFrames = [];
function setupJaibel() {
    jaiFrames.push(loadImage("assets/jaiFrames/contact.png"));
    jaiFrames.push(loadImage("assets/jaiFrames/down.png"));
    jaiFrames.push(loadImage("assets/jaiFrames/passing.png"));
    jaiFrames.push(loadImage("assets/jaiFrames/up.png"));
    jaiFrames.push(loadImage("assets/jaiFrames/air.png"));
}

let frameToAnimation = 4;

class Jaibel {
    constructor() {
        this.groundLevel = GAME_LINE;
        this.y = this.groundLevel;
        this.yVel = 0;
        this.x = 100;
        this.imgWidth = jaiFrames[0].width / 2.5;
        this.imgHeight = jaiFrames[0].height / 2.5;
        this.width = this.imgWidth / 2.3;
        this.height = this.imgHeight / 2.3;

        this.currAnimationFrame = 0;
        this.targetAnimationFrame = 0;
        this.waitFrames = frameToAnimation;
    }

    jump() {
        if (this.y === this.groundLevel) {
            this.yVel = -18;
        }
    }

    update() {
        let newFrame = false;
        if (--this.waitFrames < 0) {
            newFrame = true;
        }

        if (newFrame) {
            this.waitFrames = Math.max(1, frameToAnimation - score / 90);
            if (++this.targetAnimationFrame >= jaiFrames.length) {
                this.targetAnimationFrame = 0;
            }
        }

        if (keysPressed.has(" ")) { this.jump(); }

        this.y += this.yVel;
        this.yVel += 0.9;
        if (this.y >= this.groundLevel) {
            this.y = this.groundLevel;
            this.yVel = 0;
        } else {
            this.targetAnimationFrame = 4;
        }

        if (newFrame) {
            if (this.currAnimationFrame != this.targetAnimationFrame) {
                if (++this.currAnimationFrame >= jaiFrames.length) {
                    this.currAnimationFrame = 0;
                }
            }
        }
    }

    draw() {
        imageMode(CENTER);
        let offset = 0;
        switch (this.currAnimationFrame) {
            case 0: offset = 10; break;
            case 1: offset = 0; break;
            case 2: offset = 5; break;
            case 3: offset = 10; break;
            case 4: offset = 15; break;
        }
        let currImageFrame = jaiFrames[this.currAnimationFrame];
        image(currImageFrame, this.x, this.y - offset, this.imgWidth, this.imgHeight);
        if (showHitbox) {
            noStroke();
            fill(TRANSPARENT_RED);
            let collideWidth = this.width * 0.4;
            rect(this.x - collideWidth / 2 + 5, this.y - this.height / 2 - 15, collideWidth, this.height - 15);
        }
    }
}

console.log("jaibel.js loaded");