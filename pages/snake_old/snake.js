class Snake {
    constructor(size, w, h) {
        this.body = [];
        this.body[0] = createVector(floor(w/2),floor(h/2));
        this.xdir = 1;
        this.ydir = 0;
        this.len = 1;
        this.size = size;
        this.w = w;
        this.h = h;
    }

    update() {
        let head = this.body[this.body.length-1].copy();
        this.body.shift();
        head.x += this.xdir;
        head.y += this.ydir;
        this.body.push(head);

        if (head.x > w-1) head.x = 0;
        else if (head.x < 0) head.x = w-1;
        else if (head.y > h-1) head.y = 0;
        else if (head.y < 0) head.y = h-1;
    }

    show() {
        noStroke();
        fill(0);
        for (let i = 0; i < this.body.length; ++i) {
            rect(this.body[i].x*this.size, this.body[i].y*this.size, this.size, this.size);
        }
        
    }

    grow() {
        ++this.len;
        let head = this.body[this.body.length-1].copy();
        this.body.push(head);
    }

    endGame() {
        let x = floor(this.body[this.body.length-1].x);
        let y = floor(this.body[this.body.length-1].y);

        for (let i = 0; i < this.body.length - 1; ++i) {
            let part = this.body[i];
            if (part.x == x && part.y == y) return true;
        }

        return false;
    }

    eat(pos) {
        let x = floor(this.body[this.body.length-1].x);
        let y = floor(this.body[this.body.length-1].y);
        let px = floor(pos.x);
        let py = floor(pos.y);

        if (x == pos.x && y == pos.y) {
            console.log("FOOD EATEN");
            this.grow();
            return true;
        }
        return false;
    }

    setDir(x,y) {
        this.xdir = x;
        this.ydir = y;
    }
}