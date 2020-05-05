class Virus {
    constructor(x, y, owner) {
        this.owner = owner;
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(SIM_PARAMETERS.virusSpawnVelocity);
    }

    update() {
        this.pos.add(this.vel);

        this.vel.mult(0.98);

        if (this.vel.mag() < 0.1) {
            viruses.delete(this);
        }
    }

    tryInfect(agent) {
        if (agent == this.owner) { return }
        if (dist(this.pos.x, this.pos.y, agent.pos.x, agent.pos.y) < SIM_PARAMETERS.agentSize) {
            if (Math.random() < SIM_PARAMETERS.infectionChance && agent.infectionTime == 0) {
                agent.infectionTime = SIM_PARAMETERS.infectionTime;
            }
            viruses.delete(this);
        }
    }

    draw() {
        noStroke();
        fill(255,255,0);
        circle(this.pos.x, this.pos.y, Math.min(this.vel.mag() * 1.2, 7));
    }
}