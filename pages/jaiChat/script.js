const textArea           =   document.querySelector(".chat-app.sender textarea");
const chatAppContainer   =   document.querySelector(".chat-app.container");
const sendButton         =   document.querySelector(".chat-app .sender .send-button");
const sendButtonPlane    =   document.querySelector(".chat-app .sender .send-button img");
const messages           =   document.querySelector(".chat-app.messages");

let websocket = new WebSocket("wss://jaibel.ddns.net/ws/chat");

websocket.onmessage = message => {
    console.log(message.data);
    const messageElement = document.createElement("p");
    messageElement.innerText = message.data;
    messages.appendChild(messageElement);
};

textArea.addEventListener("wheel", event => {
    textArea.scrollBy(0, event.deltaY / 8);
    console.log(event);
});

textArea.addEventListener("keypress", event => {
    console.log(event);
    if (event.code === "Enter" && !event.shiftKey) {
        sendButton.click();
    }
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