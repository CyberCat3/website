class Scene {
    draw() {
        throw new Error("Draw method in Scene class should be overrided.");
    }

    handleMouseMoved() {
        throw new Error("HandleMouseMoved method in Scene class should be overrided.");
    }

    handleMouseClicked() {
        throw new Error("HandleMouseClicked method in Scene class should be overrided.");
    }
}