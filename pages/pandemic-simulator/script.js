const $ = query => document.querySelector(query);

const startStopSimulationBtn = $("#start-stop-simulation-btn");
const resetBtn = $("#reset-btn");
const speedBtn = $("#speed-btn");
const drawGraphBtn = $("#draw-graph-btn");
const socialDistancingBtn = $("#social-distancing-btn");
const handwashingBtn = $("#handwashing-btn");
const maskBtn = $("#mask-btn");


for (const btn of document.getElementsByClassName("pandemic-btn")) {
    btn.toggleOn = () => {
        btn.classList.add("selected");
        btn.handleToggleOn();
    }

    btn.toggleOff = () => {
        btn.classList.remove("selected");
        btn.handleToggleOff();
    }

    btn.onclick = () => {
        if (btn.classList.contains("selected")) {
            btn.toggleOff();
        } else {
            btn.toggleOn();
        }
    }
}


//##############START STOP BUTTON##############//
startStopSimulationBtn.handleToggleOn = () => {
    startStopSimulationBtn.innerText = "Stop";

    if (simOver) {
        resetSim();
    }

    loop();
}
startStopSimulationBtn.handleToggleOff = () => {
    startStopSimulationBtn.innerText = "Start";
    noLoop();
}


//##############RESET BUTTON##############//
resetBtn.handleToggleOn = () => {
    startStopSimulationBtn.toggleOff();
    resetSim();
    setTimeout(resetBtn.toggleOff, 200);
}
resetBtn.handleToggleOff = () => {};


//##############SPEED BUTTON##############//
speedBtn.handleToggleOn = () => {
    SIM_PARAMETERS.updatesPerDraw = 3;
    speedBtn.innerText = speedBtn.innerText.replace("1", "3");
}
speedBtn.handleToggleOff = () => {
    SIM_PARAMETERS.updatesPerDraw = 1;
    speedBtn.innerText = speedBtn.innerText.replace("3", "1");
}


//##############GRAPH BUTTON##############//
drawGraphBtn.handleToggleOn = () => {
    SIM_PARAMETERS.drawGraph = true;
    redraw();
}
drawGraphBtn.handleToggleOff = () => {
    SIM_PARAMETERS.drawGraph = false;
    redraw();
}
drawGraphBtn.classList.add("selected");


//##############SOCIAL DISTANCING BUTTON##############//
socialDistancingBtn.handleToggleOn = () => SIM_PARAMETERS.socialDistancing = true;
socialDistancingBtn.handleToggleOff = () => SIM_PARAMETERS.socialDistancing = false;


//##############HANDWASHING BUTTON BUTTON##############//
handwashingBtn.handleToggleOn = () => SIM_PARAMETERS.infectionChance = 0.6;
handwashingBtn.handleToggleOff = () => SIM_PARAMETERS.infectionChance = 1;


//##############MASK WEARING BUTTON##############//
maskBtn.handleToggleOn = () => SIM_PARAMETERS.virusSpawnVelocity = 1.6;
maskBtn.handleToggleOff = () => SIM_PARAMETERS.virusSpawnVelocity = 2;