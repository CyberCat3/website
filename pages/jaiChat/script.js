const textArea = document.querySelector(".chat-app.sender textarea");
const chatAppContainer = document.querySelector(".chat-app.container");

textArea.addEventListener("wheel", event => {
    textArea.scrollBy(0, event.deltaY / 8);
    console.log(event);
});

chatAppContainer.style.width = "70vw";
chatAppContainer.style.height = "70vh";
chatAppContainer.style.opacity = "0%";
setTimeout(() => {
    chatAppContainer.style.width = "90vw";
    chatAppContainer.style.height = "90vh";
    chatAppContainer.style.opacity = "100%";
}, 10);


chatAppContainer.addEventListener("click", event => {
    chatAppContainer.style.width = "90vw";
    chatAppContainer.style.height = "90vh";
});

