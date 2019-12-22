function limit(value, lower, upper) {
    if (value < lower) return lower;
    if (value > upper) return upper;
    return value;
}

function exceedsBound(value, lower, upper) {
    return value < lower || value > upper;
}


class Snake {
    constructor() {
    	this.body = [];
    	this.dir = 1;
        this.grow();
        this.grow();
        this.grow();
        this.grow();
    }

    grow() {
        let tail = this.body[0];
        if (!tail) {
            tail = {x: round(CELLS_HORIZONTAL / 5), y: round(CELLS_VERTICAL / 2.5)};
        }
        this.body.splice(0,0,{x: tail.x, y: tail.y});
    }

    update() {
    	let head = this.head = this.body[this.body.length - 1];


        for (let i = 0; i < this.body.length - 1; ++i) {
            this.body[i].x = this.body[i+1].x;
            this.body[i].y = this.body[i+1].y;
        }

    	switch (this.dir) {
    		case 0: --head.y; break;
    		case 1: ++head.x; break;
    		case 2: ++head.y; break;
    		case 3: --head.x; break;
    	}
        if      (head.x >= CELLS_HORIZONTAL) head.x = 0;
        else if (head.y >= CELLS_VERTICAL)   head.y = 0;
        else if (head.x < 0)                 head.x = CELLS_HORIZONTAL - 1;
        else if (head.y < 0)                 head.y = CELLS_VERTICAL - 1;

        for (let i = 0; i < this.body.length - 1; ++i) {
            if (head.x == this.body[i].x && head.y == this.body[i].y) {
                isDead = true;
            }
        }

    }

    changeDir(dir) {
        if (dir == 0 && this.dir == 2) return false;
        if (dir == 1 && this.dir == 3) return false;
        if (dir == 2 && this.dir == 0) return false;
        if (dir == 3 && this.dir == 1) return false;

        this.dir = dir;
        return true;
    }

    draw() {
    	for (let i = 0; i < this.body.length; ++i) {
            let part = this.body[i];
            let nextPart = this.body[i + 1];
    		
            let tox = 0;
            let toy = 0;

            if (i == this.body.length - 1) {
                switch (this.dir) {
                    case 0: toy = -1; break;
                    case 1: tox =  1; break;
                    case 2: toy =  1; break;
                    case 3: tox = -1; break;
                }
            } else {
                tox = nextPart.x - part.x;
                toy = nextPart.y - part.y;
                if (exceedsBound(tox, -1, 1)) {
                    tox = -limit(tox, -1, 1);
                }
                if (exceedsBound(toy, -1, 1)) {
                    toy = -limit(toy, -1, 1);
                }
            }

            let transitionX = transitionOffset * tox;
            let transitionY = transitionOffset * toy;

            let cx = part.x * CELL_SIZE + CELL_SIZE / 2 + transitionX;
            let cy = part.y * CELL_SIZE + CELL_SIZE / 2 + transitionY;

            stroke(255);
            strokeWeight(CELL_SIZE / 2);

            if (i == this.body.length - 1) {
                push();
                imageMode(CENTER);
                translate(cx, cy);
                if (this.dir == 0) {
                    rotate(-HALF_PI);
                } else if (this.dir == 2) {
                    rotate(HALF_PI);
                } else if (this.dir == 3) {
                    scale(-1, 1);
                }
                image(jaibelImg, 0, 0, CELL_SIZE * 1.8, CELL_SIZE * 1.8);
                pop();
                //ellipse(cx, cy, CELL_SIZE / 2);
            } else {
                ellipse(cx, cy, CELL_SIZE / 3.5);
    
            }
    	}
    }
}

console.log("snake.js loaded");