class Component {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        throw new Error("Draw method in Component class should be overridded.");
    }

    handleMouseMoved() {
        throw new Error("HandleMouseMoved method in Component class should be overridded.");
    }

    handleMouseClicked() {
        throw new Error("HandleMouseClicked method in Compoment class should be overrided.")
    }
}