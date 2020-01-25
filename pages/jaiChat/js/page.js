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

(window.onresize = event => {
    sendButton.style.width = `${sendButton.clientHeight}px`;
})();

setTimeout(window.onresize, 1200);