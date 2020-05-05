class Particle {
    constructor(x, y, color) {
        this.pos = createVector(
            x + random(-SIM_PARAMETERS.agentSize, SIM_PARAMETERS.agentSize) * 0.6,
            y + random(-SIM_PARAMETERS.agentSize, SIM_PARAMETERS.agentSize) * 0.6);

        this.vel = p5.Vector.random2D().mult(Math.random());
        this.color = color;
    }
    
    update() {
        this.pos.add(this.vel);

        this.vel.mult(0.96);

        if (this.vel.mag() < 0.1) {
            particles.delete(this);
        }
    }

    draw() {
        noStroke();
        fill(...this.color);
        circle(this.pos.x, this.pos.y, Math.min(this.vel.mag() * 7, 14));
    }


}