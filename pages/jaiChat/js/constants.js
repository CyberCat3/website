const textArea              =   document.querySelector(".chat-app.sender textarea");
const chatAppContainer      =   document.querySelector(".chat-app.container");
const sendButton            =   document.querySelector(".chat-app .sender .send-button");
const sendButtonPlane       =   document.querySelector(".chat-app .sender .send-button img");
const messages              =   document.querySelector(".chat-app.messages");
const onlineIndicator       =   document.querySelector(".chat-app.online .indicator");
const onlineIndicatorText   =   document.querySelector(".chat-app.online .indicator-text");
const loginTemplate         =   document.querySelector("#login-template");

const months = [
    "Jan",   "Feb",   "Mar",
    "Apr",   "Maj",   "Jun",
    "Jul",   "Aug",   "Sep",
    "Oct",   "Nov",   "Dec"
];