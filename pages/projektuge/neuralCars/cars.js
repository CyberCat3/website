class Car {
    constructor(x, y) {
        this.reset(x,y);
        this.brain = new NeuralNetwork(5,4,3,2);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.xVel = 0;
        this.yVel = 0;
        this.rot = PI * 0.55;
        this.corners = [
            {x: -0.1, y: -0.1}, {x: 0.1, y: -0.1},
            {x: -0.1, y:  0.1}, {x: 0.1, y:  0.1}
        ];
        this.vision = [1, 1, 1, 1, 1];
        this.timesUpdated = 0;
        this.dead = false;
    }

    update() {
        if (this.dead) { return; }

        this.xVel += Math.cos(this.rot) * 0.0007;
        this.yVel += Math.sin(this.rot) * 0.0007;

        this.x += this.xVel;
        this.y += this.yVel;

        this.xVel *= 0.85;
        this.yVel *= 0.85;

        const lc = Math.cos(this.rot) * 0.03;
        const ls = Math.sin(this.rot) * 0.03;
        const sc = Math.cos(this.rot + HALF_PI) * 0.015;
        const ss = Math.sin(this.rot + HALF_PI) * 0.015;

        this.corners[0].x = lc + sc;
        this.corners[0].y = ls + ss;

        this.corners[1].x = -lc + sc;
        this.corners[1].y = -ls + ss;

        this.corners[2].x = -lc + -sc;
        this.corners[2].y = -ls + -ss;

        this.corners[3].x = lc + -sc;
        this.corners[3].y = ls + -ss;

        for (let i = 0; i < this.corners.length; ++i) {
            
            for (const wallLine of courseWalls) {
                if (collideLineLine(
                    wallLine.pa.x, wallLine.pa.y, wallLine.pb.x, wallLine.pb.y,
                    this.corners[i].x + this.x,
                    this.corners[i].y + this.y,
                    this.corners[(i + 1) % this.corners.length].x + this.x,
                    this.corners[(i + 1) % this.corners.length].y + this.y
                )) {
                    this.dead = true;
                }
            }
        }

        for (let i = 0; i < this.vision.length; ++i) {
            const ox = Math.cos(this.rot + i * HALF_PI / 4 - QUARTER_PI);
            const oy = Math.sin(this.rot + i * HALF_PI / 4 - QUARTER_PI);
    
            let nearestPointX, nearestPointY, bestDist = Infinity;
            for (const wallLine of courseWalls) {
                const result = collideLineLine(this.x, this.y, this.x + ox, this.y + oy,
                    wallLine.pa.x, wallLine.pa.y, wallLine.pb.x, wallLine.pb.y, true);
                if (result.x) {
                    const dist = distSq(this.x, this.y, result.x, result.y);
                    if (dist < bestDist) {
                        nearestPointX = result.x;
                        nearestPointY = result.y;
                        bestDist = dist;
                    }
                }
            }
            this.vision[i] = isFinite(bestDist) ? Math.sqrt(bestDist) : 1;
            this.vision[i] = this.vision[i];
        }

        // for (let i = 0; i < this.vision.length; ++i) {
        //     this.vision[i] = map(this.vision[i], 0.02, 0.5, -1, 1);
        // }
        const brainOutput = this.brain.predict(this.vision);
        
        if (brainOutput[0] > 0.5) {
            this.rot -= 0.04;
        }
        if (brainOutput[1] > 0.5) {
            this.rot += 0.04;
        }

        // this.rot += (brainOutput[0] - 0.5) * 0.04;

        ++this.timesUpdated;
    }

    drawVisionLines() {
        push();
        translate(nptw(this.x), nptw(this.y));
        rotate(this.rot);

        stroke(160);
        strokeWeight(1);
        rotate(-QUARTER_PI);
        for (let i = 0; i < this.vision.length; ++i) {
            line(0, 0, nptw(this.vision[i]) * 0.95, 0);
            rotate(QUARTER_PI / 2);
        }
        pop(); // It looks really fun if you remove this.
    }

    draw() {
        push();
        translate(nptw(this.x), nptw(this.y));
        rotate(this.rot);

        imageMode(CENTER);
        image(carImg, 0, 0, nptw(0.07), nptw(0.05));
        
        pop();
        

        // strokeWeight(2);
        // for (let i = 0; i < this.vision.length; ++i) {
        //     const ox = Math.cos(this.rot + i * HALF_PI / 4 - QUARTER_PI);
        //     const oy = Math.sin(this.rot + i * HALF_PI / 4 - QUARTER_PI);
    
        //     let nearestPointX, nearestPointY, bestDist = Infinity;
        //     for (const wallLine of courseWalls) {
        //         const result = collideLineLine(this.x, this.y, this.x + ox, this.y + oy,
        //             wallLine.pa.x, wallLine.pa.y, wallLine.pb.x, wallLine.pb.y, true);
        //         if (result.x) {
        //             const dist = distSq(this.x, this.y, result.x, result.y);
        //             if (dist < bestDist) {
        //                 nearestPointX = result.x;
        //                 nearestPointY = result.y;
        //                 bestDist = dist;
        //             }
        //         }
        //     }

        //     fill(0,255,0);
        //     noStroke();
        //     ellipse(nptw(nearestPointX), nptw(nearestPointY), 5, 5);
            
        //     strokeWeight(2);
        //     stroke(255);
        //     line(nptw(this.x), nptw(this.y), nptw(nearestPointX), nptw(nearestPointY));
        // }


        // for (let i = 0; i < this.corners.length; ++i) {
        //     stroke(255);
        //     strokeWeight(1);
        //     line(
        //         nptw(this.corners[i].x + this.x),
        //         nptw(this.corners[i].y + this.y),
        //         nptw(this.corners[(i + 1) % this.corners.length].x + this.x),
        //         nptw(this.corners[(i + 1) % this.corners.length].y + this.y))
        // }
        
    }
}