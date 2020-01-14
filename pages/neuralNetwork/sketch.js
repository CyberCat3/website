const SKETCH_WIDTH = 1000;
const SKETCH_HEIGHT = 600;

let trainingData = [];
let loadedTrainingData = false;
let neuralNetwork;

function preload() {
    
}

function setup() {
    loadTrainingData();
    neuralNetwork = new NeuralNetwork(2,3,4,2);
    populate(70, networks);
    createCanvas(SKETCH_WIDTH, SKETCH_HEIGHT);
}

// function mousePressed(event) {
//     trainingData.push(new TrainingPoint(
//         map(mouseX, 0, SKETCH_WIDTH, -1, 1),
//         map(mouseY, 0, SKETCH_HEIGHT, -1, 1),
//         event.ctrlKey
//     ));
// }

const networks = [];

function populate(amount, arr) {
    if (!arr) { arr = []; }
    for (let i = 0; i < amount; ++i) {
        arr.push(new NeuralNetwork(2,3,4,2));
    }
    return arr;
}

function sortPopulation(arr) {
    arr.sort((n1, n2) => totalError(n1) - totalError(n2));
    return arr;
}

function herd(ratio, arr) {
    const networksToBeHerded = Math.floor(arr.length * ratio);
    for (let i = 0; i < networksToBeHerded; ++i) {
        arr.pop();
    }
    return arr;
}

function repopulate(arr) {
    const networksToBeCloned = arr.length;
    for (let i = 0; i < networksToBeCloned; ++i) {
        arr.push(arr[i].clone());
    }
    return arr;
}

function mutatePopulation(arr, amount) {
    for (const network of arr) {
        network.mutate(amount);
    }
    return arr;
}

function doGeneration(arr) {
    sortPopulation(arr);
    herd(0.5, arr);
    const prevAvgError = totalError(neuralNetwork);
    const currAvgError = totalError(arr[0]);
    if (currAvgError < prevAvgError) {
        neuralNetwork = arr[0];
    }
    repopulate(arr);
    mutatePopulation(arr, 0.15);
    return totalError(neuralNetwork);
}

async function loadTrainingData() {
    // Fetches training data.json and converts it json.
    const response = await fetch("training_data_linear.json");
    const json = await response.json();
    // Maps the aquirred training data to actual training points, so we have our functions.
    trainingData = json.map(({x,y,isRed}) => new TrainingPoint(x,y,isRed));
    loadedTrainingData = true;
    console.log("loaded training data");
}

function totalError(someNetwork) {
    const inputsArray = trainingData.map(point => [point.x, point.y]);
    const expectedOutputArray = trainingData.map(point => point.isRed ? [0, 1] : [1, 0]);
    
    return someNetwork.calcAverageError(inputsArray, expectedOutputArray);
}

const networkPos = {width: 400, height: 300}
networkPos.x = SKETCH_WIDTH  / 2 - networkPos.width  / 2;
networkPos.y = SKETCH_HEIGHT / 2 - networkPos.height / 2;

function draw() {
    background(20);
    
    //neuralNetwork.draw(0,0,400,300);
    if (!loadedTrainingData) { return; }
    for (const trainingPoint of trainingData) {
        const inputs = [trainingPoint.x, trainingPoint.y];
        const outputs = neuralNetwork.predict(inputs);
        trainingPoint.draw(outputs[0] < outputs[1]);
    }

    // noStroke();
    // for (let x = 0; x < SKETCH_WIDTH; x += SKETCH_WIDTH / 40) {
    //     for (let y = 0; y < SKETCH_HEIGHT; y += SKETCH_HEIGHT / 40) {
    //         const input = [map(x,0,SKETCH_WIDTH,-1,1),
    //                        map(y,0,SKETCH_HEIGHT,-1,1)];
    //         const prediction = neuralNetwork.predict(...input);

    //         if (prediction[0] > prediction[1]) {
    //             fill("rgba(255,0,0,0.1)");
    //         } else {
    //             fill("rgba(0,255,0,0.1)");
    //         }
    //         rect(x, y, SKETCH_WIDTH / 50, SKETCH_HEIGHT / 50);
    //     }
    // }

    noStroke();
    fill(30,30,30);
    rect(0,0,300,250);
    neuralNetwork.draw(0,0,300,250);

    

    //console.log(`Total Error: ${totalError(neuralNetwork)}`)
    stroke(20);
    fill(255);
    textSize(30);
    textAlign(CENTER);
    const cost = doGeneration(networks);
    text(`Generation #${++generation}`, SKETCH_WIDTH / 2, SKETCH_HEIGHT - 40);
    text(`Cost: ${cost.toFixed(5)}`, SKETCH_WIDTH / 2, SKETCH_HEIGHT - 10);

}

let currLayer = 1;
let currPerceptron = 0;
let currWeight = -1;

let generation = 0;












function createNeuralSliders() {
    for (let layer = 1; layer < neuralNetwork.network.length; ++layer) {
        const currLayer = layer;
        
        console.log({currLayer});
        
        for (let perceptron = 0; perceptron < neuralNetwork.network[currLayer].length; ++perceptron) {
            const currPerceptron = perceptron;
            console.log({currPerceptron});

            const biasSlider = createSlider(-2.5, 2.5, neuralNetwork.network[currLayer][currPerceptron]);
            biasSlider.input(() => neuralNetwork.network[currLayer][currPerceptron].bias = biasSlider.value());

            for (let weight = 0; weight < neuralNetwork.network[currLayer][currPerceptron].weights.length; ++weight) {
                const currWeight = weight;
                console.log({currWeight});
                const slider = createSlider(-2.5,2.5,
                    neuralNetwork.network[currLayer][currPerceptron].weights[currWeight]);

                slider.input(() => neuralNetwork.network[currLayer][currPerceptron].weights[currWeight] = slider.value());
            }
        }
    }
}