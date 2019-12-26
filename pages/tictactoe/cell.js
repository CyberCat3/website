class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.framesDrawn = 0;
    }

    draw() {
        push();
        translate(this.x * cellSize + cellSize * 0.5, this.y * cellSize + cellSize * 0.5);
        noFill();
        stroke(0);
        strokeWeight(strokeSize);
    }
}

class Naught extends Cell {
    constructor(x, y) {
        super(x,y);
    }

    draw() {
        super.draw();

        if (++this.framesDrawn > 36) {
            this.framesDrawn = 36;
            circle(0,0, cellSize / 1.2);
            pop();
            return;
        }

        let scaledDown = map(this.framesDrawn, 0, 36, 0, 5);
        let eased = -0.3*scaledDown**2+3*scaledDown;
        let radians = map(eased, 0, 7.5, 0, TWO_PI);
        
        arc(0,0, cellSize / 1.2,cellSize / 1.2, 0, radians);            
        pop();
    }
}

class Cross extends Cell {
    constructor(x,y) {
        super(x,y);
    }

    draw() {
        super.draw();
        let lineSize = cellSize / 2.8;

        if (++this.framesDrawn > 30) {
            this.framesDrawn = 30;
            line(-lineSize, -lineSize, lineSize, lineSize);
            line(-lineSize, lineSize, lineSize, -lineSize);
        } else {
            let scaledDown = map(this.framesDrawn, 0, 30, 0, 5);
            let eased = -0.3*scaledDown**2+3*scaledDown;
            let spanLength = map(eased, 0, 7.5, -lineSize, lineSize);
    
            line(-lineSize, -lineSize, spanLength, spanLength);
            line(-lineSize, lineSize, spanLength, -spanLength);
        }
        
        pop();
    }
}

console.log("cell.js loaded");