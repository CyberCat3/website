const Colors = {
    SICK_COLOR: [255,255,0],
    HEALTHY_COLOR: [0,255,255],
    IMMUNE_COLOR: [50,50,50],
    DEATH_COLOR: [255, 50, 50]};

const agents = new Set();
const viruses = new Set();
const particles = new Set();

const snapshots = [];

const SIM_PARAMETERS = {
    virusSpawnChance: 0.02,
    virusSpawnVelocity: 2,
    infectionTime: 1000,
    deathChance: 0.5,
    infectionChance: 1,
    agentSize: 10,
    populationSize: 600,
    updatesPerDraw: 1,
    snapshotFrequency: 8,
    socialDistancing: false,
    drawGraph: true
};

let snapshotIn = SIM_PARAMETERS.snapshotFrequency;

function agentDeathHandler() {agents.delete(this)}


let simOver = false;
function stopSim() {
    noLoop();
    simOver = true;
    startStopSimulationBtn.toggleOff();
}

function setup() {
    frameRate(60);
    createCanvas(1650, 1100).parent("p5-sketch-holder");
    resetSim();
}

function resetSim() {
    snapshots.length = 0;
    viruses.clear();
    agents.clear();
    simOver = false;
    for (let i = 0; i < SIM_PARAMETERS.populationSize; ++i) {

        agents.add(new Agent(Math.random() * width, Math.random() * height, agentDeathHandler));
    }

    specialAgent = new Agent(width / 2, height / 2, agentDeathHandler);
    specialAgent.infectionTime = SIM_PARAMETERS.infectionTime;
    agents.add(specialAgent);
    noLoop();
}

function drawSim() {
    stroke(50);
    strokeWeight(10);
    fill(0);
    rect(0,0, width, height);

    for (let i = 0; i < SIM_PARAMETERS.updatesPerDraw; ++i) {
        for (const agent of agents) {
            agent.update();
            
            if (SIM_PARAMETERS.socialDistancing) {
                for (const agent2 of agents) {
                    if (agent !== agent2) {
                        agent.socialDistance(agent2);
                    }
                }
            }
        }
        
        for (const virus of viruses) {
            virus.update();
    
            for (const agent of agents) {
                virus.tryInfect(agent);
            }
        }
    
        for (const particle of particles) {
            particle.update();
        }

        snapshotHandler();
    }

    for (const agent of agents) { agent.draw(); }
    for (const virus of viruses) { virus.draw(); }
    for (const particle of particles) { particle.draw(); }

    // const index = Math.floor(Math.random() * agents.size);
    // let counter = 0;
    // for (const agent of agents) {
    //     if (counter++ == index) {
    //         agent.pos.x = width / 2;
    //         agent.pos.y = height / 2;
    //         break;
    //     }
    // }
}

function snapshotHandler() {

    if (--snapshotIn == 0) {
        snapshotIn = SIM_PARAMETERS.snapshotFrequency;

        let healthy = 0;
        let sick = 0;
        let immune = 0;

        for (const agent of agents) {
            if (agent.infectionTime == -1) {
                ++immune;
            } else if (agent.infectionTime == 0) {
                ++healthy;
            } else if (agent.infectionTime >= 1) {
                ++sick;
            }
        }

        if (viruses.size == 0 && sick == 0) {
            stopSim();            
        } 
        snapshots.push([healthy, sick, immune]);
    }
}

function drawGraph() {
    const barWidth = width / snapshots.length;

    const ratio = height / SIM_PARAMETERS.populationSize;

    noStroke();

    for (let i = 0; i < snapshots.length; ++i) {
        const snapshot = snapshots[i];
        

        
        const [healthy, sick, immune] = snapshot;

        const totalAlive = healthy + sick + immune;

        const [healthyPixels, sickPixels, immunePixels, deadPixels] = 
            [healthy, sick, immune, SIM_PARAMETERS.populationSize - totalAlive].map(v => v * ratio);

        fill(Colors.SICK_COLOR);
        rect(Math.ceil(i * barWidth), height - sickPixels, Math.ceil(barWidth), sickPixels);

        // fill(Colors.DEATH_COLOR);
        // rect(Math.ceil(i * barWidth), 0, Math.ceil(barWidth), deadPixels);

        
        // let offsetPoint = 0;
        
        // fill(Colors.HEALTHY_COLOR);
        // rect(Math.ceil(i * barWidth), offsetPoint, Math.ceil(barWidth), healthyPixels);
        // offsetPoint += healthyPixels;
        
        // fill(Colors.SICK_COLOR);
        // rect(Math.ceil(i * barWidth), offsetPoint, Math.ceil(barWidth), offsetPoint + sickPixels);
        // offsetPoint += sickPixels;
        
        // fill(Colors.IMMUNE_COLOR);
        // rect(Math.ceil(i * barWidth), offsetPoint, Math.ceil(barWidth), offsetPoint + immunePixels);
        // offsetPoint += immunePixels;
        
        // fill(Colors.DEATH_COLOR);
        // rect(Math.ceil(i * barWidth), offsetPoint, Math.ceil(barWidth), offsetPoint + deadPixels);
    }

    noStroke();
    fill(255);
    textSize(48);
    text(`Tid: ${Math.round(snapshots.length / 60 * SIM_PARAMETERS.snapshotFrequency)}`, 10, 50);
}

function draw() {
    drawSim();
    if (SIM_PARAMETERS.drawGraph) {
        drawGraph();
    }
}