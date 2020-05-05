class Agent {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0,0);
        this.infectionTime = 0;

        this.desiredColor = [0,0,0];
        this.color = [0,0,0];
    }


    update() {
        //////////////    MOVEMENT    //////////////
        this.pos.add(this.vel);
        this.vel.x += (Math.random() - 0.5) / 5;
        this.vel.y += (Math.random() - 0.5) / 5;

        this.vel.mult(0.98);

        if (this.pos.x < 15) {
            this.vel.x += 0.1;
        } else if (this.pos.x > width - 15) {
            this.vel.x -= 0.1;
        }

        if (this.pos.y < 15) {
            this.vel.y += 0.1;
        } else if (this.pos.y > height - 15) {
            this.vel.y -= 0.1;
        }


        //////////////    HANDLE BEING SICK    //////////////
        if (this.infectionTime > 0) {
            if (Math.random() < SIM_PARAMETERS.virusSpawnChance) {
                viruses.add(new Virus(this.pos.x, this.pos.y, this));
            }

            this.infectionTime -= 1;
            if (this.infectionTime == 0) {
                if (Math.random() < SIM_PARAMETERS.deathChance) {
                    for (let i = 0; i < 100; ++i) {
                        particles.add(new Particle(
                            this.pos.x, this.pos.y,
                            Math.random() < 0.5 ? Colors.DEATH_COLOR : Colors.SICK_COLOR));
                    }
                    agents.delete(this);
                    return;
                } else {
                    this.infectionTime = -1
                }
            }
            
        }


        //////////////    COLOR    //////////////
        if (this.infectionTime == -1) {
            this.desiredColor = Colors.IMMUNE_COLOR;
        } else if (this.infectionTime == 0) {
            this.desiredColor = Colors.HEALTHY_COLOR;
        } else if (this.infectionTime >= 1) {
            this.desiredColor = Colors.SICK_COLOR;
        }

        for (let i = 0; i < this.color.length; ++i) {
            this.color[i] += (this.desiredColor[i] - this.color[i]) / 10;
        }
    }

    socialDistance(otherAgent) {
        const xDiff = otherAgent.pos.x - this.pos.x;
        const yDiff = otherAgent.pos.y - this.pos.y;

        const totalDistSq = xDiff * xDiff + yDiff * yDiff;
        

        if (totalDistSq < 70 * 70) {
            const totalDist = Math.sqrt(totalDistSq);
            strokeWeight(1);
            stroke(255,255,255);

            this.vel.x -= xDiff / 1000;
            this.vel.y -= yDiff / 1000;
        }
    }

    draw() {
        noStroke();
        fill(...this.color);
        circle(this.pos.x, this.pos.y, SIM_PARAMETERS.agentSize);
    }
}