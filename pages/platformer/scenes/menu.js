// BRING-IN scenes/scene.js
// BRING-IN components/button.js

class Menu extends Scene {
    constructor() {
        super();
        this.buttons = [
            new Button("PLAY", 100, 100, 400, 100, () => console.log("Play Button Clicked")),
            new Button("SETTINGS", 100, 220, 400, 100, () => console.log("Play Button Clicked")),
            new Button("QUIT", 100, 340, 400, 100, () => {
                bringIn("scenes/menu2.js").then(() => {
                    currScene = new Menu2();
                })
            })
        ]
    }
    setup() {
        console.log("Setup the main menu");
    }

    draw() {
        background(0);
        for (const btn of this.buttons) {
            btn.draw();
        }
    }

    handleMouseMoved() {
        this.buttons.forEach(btn => btn.handleMouseMoved());
    }
    
    handleMouseClicked() {
        this.buttons.forEach(btn => btn.handleMouseClicked());
    }
}