let currPlayerIndicator;

function changeCurrPlayerIndicator(player) {
    currPlayerIndicator.style.transform = "scale(0.1,0.1)";
    setTimeout(() => {
        currPlayerIndicator.innerText = player;
        currPlayerIndicator.style.transform = "scale(1,1)";
    }, 100);
}

function patchHTML() {
    currPlayerIndicator = document.querySelector(".hbox > p");
    let vbox = document.querySelector(".hbox > .vbox");
    currPlayerIndicator.style.fontSize = `${vbox.clientHeight}px`;
    fixButton();
}

function fixButton() {
    let header = document.getElementById("titleHeader");
    let button = document.getElementById("backButton");
    
    button.style.width = "80px";
    button.style.height = `${header.clientHeight}px`;
}

console.log("page.js loaded");