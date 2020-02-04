function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, (-1 * x)));
}

function map(number, minOne, maxOne, minTwo, maxTwo) {
    return minTwo + (maxTwo - minTwo) * ((number - minOne) / (maxOne - minOne));
}

class NeuralNetwork {
    constructor(...layers) {
        this.shape = layers;
        this.network = [];
        for (let i in layers) {
            const perceptronCount = layers[i];
            const layer = [];
            for (let j = 0; j < perceptronCount; ++j) {
                if (i == 0) {
                    layer.push(new InputPerceptron());
                } else {
                    layer.push(new Perceptron(this.network[i-1]));
                }
            }
            this.network.push(layer);
        }
    }

    calcAverageError(inputsArr, expectedOutputsArr) {
        let totalError = 0;
        for (let i = 0; i < Math.min(inputsArr.length, expectedOutputsArr.length); ++i) {
            totalError += this.calcError(inputsArr[i], expectedOutputsArr[i]);
        }
        return totalError / Math.min(inputsArr.length, expectedOutputsArr.length);
    }

    calcError(inputs, expectedOutputs) {
        const outputs = this.predict(inputs);
        let error = 0;
        for (let i = 0; i < outputs.length; ++i) {
            error += (outputs[i] - expectedOutputs[i]) ** 2;
        }
        return error;
    }

    predict(inputs) {
        for (let i = 0; i < inputs.length; ++i) {
            this.network[0][i].val = inputs[i];
        }

        let outputs = [];
        for (let outputPerceptron of this.network[this.network.length - 1]) {
            outputs.push(outputPerceptron.activation());
        }
        return outputs;
    }

    clone() {
        const clonedNetwork = new NeuralNetwork(...this.shape);
        for (let layer = 1; layer < this.network.length; ++layer) {
            for (let perceptron = 0; perceptron < this.network[layer].length; ++perceptron) {
                clonedNetwork.network[layer][perceptron].bias =
                         this.network[layer][perceptron].bias;
                for (let weight = 0; weight < this.network[layer][perceptron].weights.length; ++weight) {
                    clonedNetwork.network[layer][perceptron].weights[weight] =
                             this.network[layer][perceptron].weights[weight];
                }
            }
        }
        return clonedNetwork;
    }

    mutate(rate) {
        const getNewVal = (val) => val += Math.random() * (rate * 2) - rate;
        for (let layerIndex = 1; layerIndex < this.network.length; ++layerIndex) {
            const layer = this.network[layerIndex];
            for (const perceptron of layer) {
                perceptron.bias = getNewVal(perceptron.bias);
                for (let weightIndex = 0; weightIndex < perceptron.weights.length; ++weightIndex) {
                    perceptron.weights[weightIndex] = getNewVal(perceptron.weights[weightIndex]);
                }
            }
        }
    }

    draw(x, y, width, height, withText) {
        const xStep = width / this.network.length;
        
        push();
        translate(x,y);

        stroke(255);
        noFill();
        rect(0,0,width,height);

        for (let layerIndex = 0; layerIndex < this.network.length; ++layerIndex) {
            const yStep = height / this.network[layerIndex].length;
            const layer = this.network[layerIndex];
            push();
            translate( xStep * (layerIndex + 0.5), 0);

            for (let cellIndex = 0; cellIndex < this.network[layerIndex].length; ++cellIndex) {
                const cell = this.network[layerIndex][cellIndex];
                push();
                translate(0,  yStep * (cellIndex + 0.5) );

                if (layerIndex !== 0) {
                    for (let childIndex = 0; childIndex < cell.children.length; ++childIndex) {
                        const child = cell.children[childIndex];
                        if (cell.weights[childIndex] > 0) { stroke(0,255,0); }
                        else                              { stroke(255,0,0); }
                        strokeWeight(cell.weights[childIndex] + 2);
                        const prevYStep = height / this.network[layerIndex - 1].length;
                        const dx = -xStep;
                        const dy = -yStep * (cellIndex + 0.5) + prevYStep * (childIndex + 0.5);
                        line(0,0,dx,dy);

                        if (layerIndex - 1 === 0) {
                            stroke(255,255,0);
                        } else {
                            if (child.bias > 0) { stroke(0, 255, 0); }
                            else                { stroke(255, 0, 0); }
                        }
                        
                        strokeWeight(2 + Math.abs(child.bias) * 2);
                        fill(90,0,90);
                        circle(dx,dy,Math.min(xStep,prevYStep) / 2);
                        if (withText) {
                            textAlign(CENTER);
                            textSize(Math.min(xStep,prevYStep) / 6);
                            noStroke();
                            fill(255);
                            const activation = child.activation();
                            if (activation) {
                                if (activation.toFixed) {
                                    text(activation.toFixed(3), dx, dy);
                                }
                            }
                        }
                    }
                }

                if (layerIndex === this.network.length - 1) {
                    if (cell.bias > 0) { stroke(0, 255, 0); }
                    else               { stroke(255, 0, 0); }
                    
                    strokeWeight(2 + Math.abs(cell.bias) * 2);
                    fill(90,0,90);
                    circle(0,0,Math.min(xStep,yStep) / 2);
                    if (withText) {
                        textAlign(CENTER);
                        textSize(Math.min(xStep,yStep) / 6);
                        noStroke();
                        fill(255);
                        const activation = cell.activation();
                        if (activation) {
                            text(activation.toFixed(3), 0, 0);
                        }
                    }
                }
                
                pop();
            }

            pop();
        }
        pop();
    }
}

class Perceptron {
    
    constructor(children) {
        this.children = children;
        this.weights = [];
        for (let i = 0; i < children.length; ++i) {
            this.weights.push(randomGaussian() / Math.sqrt(children.length));
        }
        this.bias = randomGaussian() / Math.sqrt(children.length);
    }

    activation() {
        let sum = this.bias;
        for (let i = 0; i < this.children.length; ++i) {
            sum += this.children[i].activation() * this.weights[i];
        }
        return sigmoid(sum);
    }
}

class InputPerceptron {    
    constructor(initVal) {
        this.val = initVal;
    }

    activation() {
        return this.val;
    }
}