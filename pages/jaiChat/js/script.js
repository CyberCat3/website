let websocket;
let isOnline = false;
let username, password;

try {
    ({username, password} = JSON.parse(localStorage.getItem(LOGIN_INFO_KEY)));
    console.log("Got username and password from localStorage");
} catch {
    console.log("localStorage doesn't contain loginInfo");
}

setInterval(() => {
    if (!websocket || websocket.readyState === websocket.CLOSED) {
        setTimeout(setupWebsocket, 700);
    }
}, 2500);
setupWebsocket();