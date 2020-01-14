class TrainingPoint {
    constructor(x, y, isRed) {
        if (!x) { x = Math.random() * 2 - 1; }
        if (!y) { y = Math.random() * 2 - 1; }
        
        this.x = x;
        this.y = y;
        this.isRed = isRed;
    }

    toTrainingExample() {
        return [
            [this.x, this.y],
            this.isRed ? [0,1] : [1,0]
        ];
    }

    draw(predictedRed) {
        if (this.isRed) { stroke("#e74c3c"); }
        else            { stroke("#2ecc71"); }
        
        if (predictedRed) { fill("#e74c3c"); }
        else              { fill("#2ecc71"); }
    
        strokeWeight(4);
        const pixelX = map(this.x, -1, 1, 0, SKETCH_WIDTH);
        const pixelY = map(this.y, -1, 1, 0, SKETCH_HEIGHT);
        circle(pixelX, pixelY, 20);
    }
}