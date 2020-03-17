// BRING-IN scenes/menu.js

class Menu2 extends Menu {
    constructor() {
        super();
        this.buttons.forEach(btn => {
            btn.x += Math.random() * 300;
            btn.y += Math.random() * 300;
        });
        this.buttons.push(new Button("Ahh!", 600, 600, 100, 100, () => currScene = new Menu()));

        let intervalId;
        intervalId = setInterval(() => {
            if (currScene !== this) {
                clearInterval(intervalId);
                return;
            }
            this.buttons.forEach(btn => {
                btn.x = Math.random() * windowWidth;
                btn.y = Math.random() * windowHeight;
            });
        }, 2000);
    }
}