function fixButton() {
    let header = document.getElementById("titleHeader");
    let button = document.getElementById("backButton");
    
    button.style.width = "80px";
    button.style.height = `${header.clientHeight}px`;
}