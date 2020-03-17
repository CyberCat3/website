// BRING-IN components/component.js

class Button extends Component {
    constructor(text, x, y, w, h, onclick) {
        super(x, y, w, h);
        this.text = text;
        this.onclick = onclick;
    }

    handleMouseMoved() {
        this.mouseInside = 
            mouseX > this.x &&
            mouseX < this.x + this.w &&
            mouseY > this.y &&
            mouseY < this.y + this.h;
    }

    handleMouseClicked() {
        if (this.mouseInside) {
            this.onclick();
        }
    }

    draw() {
        fill(255);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        textAlign(CENTER);
        fill(this.mouseInside ? "rgb(0,255,0)" : "rgb(0,0,0)");
        textSize(48);
        text(this.text, this.x + this.w / 2, this.y + this.h / 2 + 48 / 3);
    }
}