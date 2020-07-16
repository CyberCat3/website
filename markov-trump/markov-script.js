Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.lastElement = function() {
    return this[this.length - 1];
}


async function getMarkovTrainingData() {
    return await fetch("./markov-input.txt").then(data => data.text());
}

function generateMarkovChain(words) {
    const markovChain = {};

    for (let i = 0; i < words.length - 1; ++i) {
        const currWord = words[i];
        const nextWord = words[i + 1];

        if (markovChain[currWord]) {
            markovChain[currWord].push(nextWord);
        } else {
            markovChain[currWord] = [nextWord];
        }
    }

    return markovChain;
}

function generateWords(startingWord, wordCount, markovChain) {
    const generatedWords = [startingWord];

    while (generatedWords.length < wordCount) {
        const nextWord = markovChain[generatedWords.lastElement()].randomElement();
    
        if (!markovChain[nextWord]) {
            continue;
        }
    
        generatedWords.push(nextWord);
    }

    return generatedWords.join(" ");
}

async function run() {
    const markovText = await getMarkovTrainingData();
    const words = markovText.split(/\s+/);
    const markovChain = generateMarkovChain(words);

    const generateButton = document.querySelector("#generate-btn");
    const form = document.querySelector(".form-grid");
    const wordCountSelector = document.querySelector("#words-to-generate");
    const resultTextArea = document.querySelector("#markov-text");


    form.onsubmit = e => {
        e.preventDefault();
        resultTextArea.value = generateWords(
            words.randomElement(), // startingWOrd
            wordCountSelector.value, // wordCount
            markovChain // chain
        );
    };
}

run();