const textArea              =   document.querySelector(".chat-app.sender textarea");
const chatAppContainer      =   document.querySelector(".chat-app.container");
const sendButton            =   document.querySelector(".chat-app .sender .send-button");
const sendButtonPlane       =   document.querySelector(".chat-app .sender .send-button img");
const messages              =   document.querySelector(".chat-app.messages");
const onlineIndicator       =   document.querySelector(".chat-app.online .indicator");
const onlineIndicatorText   =   document.querySelector(".chat-app.online .indicator-text");

let websocket;
let isOnline = false;
setInterval(() => {
    if (!websocket || websocket.readyState === websocket.CLOSED) {
        setTimeout(setupWebsocket, 700);
    }
}, 2000);
setupWebsocket();

function setupWebsocket() {
    websocket = new WebSocket("wss://jaibel.ddns.net/ws/chat");
    
    websocket.onopen = online;
    websocket.onclose = offline;

    websocket.onmessage = message => {

        
        const messageElement = createMessageElement("Some Human", message.data, new Date().getTime(), Math.random() > 0.5);
        messages.appendChild(messageElement);
        const distFromBottom = messages.scrollHeight - messages.clientHeight - messages.scrollTop;
        if (distFromBottom < 200) {
            messages.scrollBy(0, distFromBottom - 20);
        }
    };

    websocket.onerror = error => {
        console.err("A WebSocket error occurred:", error);
    };
}

textArea.addEventListener("wheel", event => {
    textArea.scrollBy(0, event.deltaY / 8);
}, {passive: true});

textArea.addEventListener("keypress", event => {
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
    if (isOnline) {
        sendButtonPlane.classList.add("send-animation");
        websocket.send(textArea.value);
        textArea.value = "";
    }
}

function online() {
    onlineIndicator.style.opacity = "0%";
    onlineIndicatorText.style.opacity = "0%";
    setTimeout(() => {
        onlineIndicatorText.innerText = "Online";
        onlineIndicator.style.opacity = "60%";
        onlineIndicatorText.style.opacity = "60%";
        onlineIndicator.style.backgroundColor = "#2ecc71";
    }, 700);
    sendButtonPlane.style.opacity = "70%";
    isOnline = true;
}

function offline() {
    onlineIndicator.style.opacity = "0%";
    onlineIndicatorText.style.opacity = "0%";
    setTimeout(() => {
        onlineIndicatorText.innerText = "Offline";
        onlineIndicator.style.backgroundColor = "#e74c3c";
        onlineIndicator.style.opacity = "60%";
        onlineIndicatorText.style.opacity = "60%";
    }, 700);
    sendButtonPlane.style.opacity = "20%";
    isOnline = false;
}

const months = [
    "Jan",   "Feb",   "Mar",
    "Apr",   "Maj",   "Jun",
    "Jul",   "Aug",   "Sep",
    "Oct",   "Nov",   "Dec"
];

function formatTime(millis) {
    const date = new Date(millis);
    return `${date.getHours().toString().padStart(2,0)}:${date.getMinutes().toString().padStart(2,0)} ${date.getDate()}. ${months[date.getMonth()]}. ${date.getFullYear()}`;
}

function createMessageElement(person, content, date, isRight) {
    const html = `<div class="message${isRight ? " right" : ""}"><h3 class="message-sender">${person}</h3><p class="message-content">${content}</p>${formatTime(date)}</div>`;
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}