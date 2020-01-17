function setupWebsocket() {
    if (window.location.href.indexOf("jaibel.ddns.net") === -1) {
        websocket = new WebSocket("ws://localhost:8080");
        console.log("connecting to localhost");
    } else {
        websocket = new WebSocket("wss://jaibel.ddns.net/ws/chat");
        console.log("connecting to jaibel servers");
    }

    messages.appendChild(loginTemplate.content);
    
    websocket.onopen = online;
    websocket.onclose = offline;

    websocket.onmessage = message => {
        receiveMessage("Some Human", message.data, new Date().getTime(), Math.random() > 0.5);
    };
}

function receiveMessage(person, messageContent, unixEpochTimeMillis, isRight) {
    const messageElement = createMessageElement(person, messageContent, unixEpochTimeMillis, isRight);
    messages.appendChild(messageElement);
    // The animation doesn't work, if this timeout isn't here.
    setTimeout(() => messages.lastElementChild.style.opacity = "100%", 0);
    const distFromBottom = messages.scrollHeight - messages.clientHeight - messages.scrollTop;
    if (distFromBottom < 200) {
        messages.scrollBy(0, distFromBottom - 20);
    }
}

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

function formatTime(millis) {
    const date = new Date(millis);
    return `${date.getHours().toString().padStart(2,0)}:${date.getMinutes().toString().padStart(2,0)} ${date.getDate()}. ${months[date.getMonth()]}. ${date.getFullYear()}`;
}

function createMessageElement(person, messageContent, date, isRight, isTheMessageContentHTML) {
    const html = `<div class="message${isRight ? " right" : ""}"><h3 class="message-sender">${person}</h3><p class="message-content">${messageContent}</p>${formatTime(date)}</div>`;
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}