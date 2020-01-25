const docQuery = query => document.querySelector(query);

const textArea                =   docQuery(".chat-app.sender textarea");
const chatAppContainer        =   docQuery(".chat-app.container");
const sendButton              =   docQuery(".chat-app .sender .send-button");
const sendButtonPlane         =   docQuery(".chat-app .sender .send-button img");
const messages                =   docQuery(".chat-app.messages");
const onlineIndicator         =   docQuery(".chat-app.online .indicator");
const onlineIndicatorText     =   docQuery(".chat-app.online .indicator-text");
const loginTemplate           =   docQuery("#login-template");
const signInTemplate          =   docQuery("#sign-in-template");
const signUpTemplate          =   docQuery("#sign-up-template");
const loggedInIndicatorDiv    =   docQuery(".chat-app .login-indicator-container")
const loggedInIndicatorText   =   docQuery("#logged-in-indicator-text");
const usernameIndicator       =   docQuery(".username-indicator");
const logOutButton            =   docQuery(".log-out-button");

const months = [
    "Jan",   "Feb",   "Mar",
    "Apr",   "Maj",   "Jun",
    "Jul",   "Aug",   "Sep",
    "Oct",   "Nov",   "Dec"
];