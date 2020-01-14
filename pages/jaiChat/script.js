const textArea = document.querySelector(".chat-app.sender textarea");
const chatAppContainer = document.querySelector(".chat-app.container");
const sendButton = document.querySelector(".chat-app .sender .send-button");
const sendButtonPlane = document.querySelector(".chat-app .sender .send-button img");

let websocket = new WebSocket("wss://jaibel.ddns.net/ws/chat");

websocket.onmessage = message => {
    console.log(message.data);
};

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

sendButtonPlane.addEventListener("animationend", () => {
    sendButtonPlane.classList.remove("send-animation");
});

function send() {
    sendButtonPlane.classList.add("send-animation");
    console.log(textArea.value);
    websocket.send(textArea.value);
    textArea.value = "";
}