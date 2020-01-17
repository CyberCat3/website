let websocket;
let isOnline = false;
setInterval(() => {
    if (!websocket || websocket.readyState === websocket.CLOSED) {
        setTimeout(setupWebsocket, 700);
    }
}, 2000);
setupWebsocket();