let loginRealForm, loginForm, loginContent;
let signInHeader, signInContent, signInButton, signInUsername, signInPassword;
let signUpHeader, signUpContent, signUpButton, signUpUsername, signUpPassword, signUpConfirmPassword;

let isLoggedIn = false;

function hideLogin() {
    setTimeout(() => {
        loginForm.style.opacity = "0%";
        loginForm.style.pointerEvents = "none";
        setTimeout(() => {
            loginForm.style.maxHeight = "0px"
            loginForm.style.marginBottom = "-30px";
        }, 400);
    }, 110);
    setTimeout(() => loginForm.style.visibility = "hidden", 810);
}

function showLogin() {
    messages.appendChild(loginTemplate.content);
    //-------------GETS THE HTML ELEMENTS-------------//
    loginRealForm           =   docQuery(".login-real-form");
    loginForm               =   docQuery(".login-form");
    loginContent            =   docQuery(".login-form .login-content");
    
    signInHeader            =   docQuery(".login-form .sign-in-header");
    signInContent           =   docQuery(".login-form .sign-in-content");
    signInButton            =   docQuery(".login-form .sign-in-content .login-button");
    signInUsername          =   docQuery("#login-sign-in-username-input");
    signInPassword          =   docQuery("#login-sign-in-password-input");
    signInRememberMe        =   docQuery("#remember-me-sign-in");

    signUpHeader            =   docQuery(".login-form .sign-up-header");
    signUpContent           =   docQuery(".login-form .sign-up-content");
    signUpButton            =   docQuery(".login-form .sign-up-content .login-button");
    signUpUsername          =   docQuery("#login-sign-up-username-input");
    signUpPassword          =   docQuery("#login-sign-up-password-input");
    signUpConfirmPassword   =   docQuery("#login-sign-up-confirm-password-input");
    signUpRememberMe        =   docQuery("#remember-me-sign-up");

    //-------------SHOWS LOGIN-------------//
    loginForm.style.removeProperty("pointer-events");
    usernameIndicator.style.visibility = "visible";
    loginForm.style.marginBottom = "20px";
    setTimeout(() => loginForm.style.opacity = "100%", 100);

    //-------------DECLARES FUNCTIONS-------------//
    /* This function checks if the form contains a valid 
    sign-in, and disables/enables the sign-in button accordingly */
    const checkIfValidSignIn = () => {
        signInButton.disabled = !(signInUsername.value.length && signInPassword.value.length);
    };

    /* This function checks if the form contains a valid
    sign-up, and disables/enables the sign-up button accordingly */
    const checkIfValidSignUp = () => {
        signUpButton.disabled = !(
            signUpUsername.value.length && signUpPassword.value.length
            && signUpPassword.value === signUpConfirmPassword.value
        );
    }

    /* This function checks if the passwords match
    It also colours the fields. */
    const signUpPasswordsMatch = () => {
        if (!signUpConfirmPassword.value.length) { return; }
        if (signUpConfirmPassword.value === signUpPassword.value) {
            signUpConfirmPassword.style.border = "3px solid #2ecc71";
        } else {
            signUpConfirmPassword.style.border = "3px solid #e74c3c";
        }
    }
    //-------------ASIGNS EVENT HANDLERS-------------//
    // Sign up
    signUpPassword.onkeyup = signUpConfirmPassword.onkeyup = () => {
        checkIfValidSignUp();
        signUpPasswordsMatch();
    };
    signUpUsername.onkeyup = checkIfValidSignUp;

    // Sign in
    (signInUsername.onkeyup = signInPassword.onkeyup = checkIfValidSignIn)();

    // sign up when you press enter
    signUpConfirmPassword.onkeydown = event => {
        if (event.key === "Enter" && !signUpButton.disabled) {
            signUpButton.click();
        }
    }

    //-------------TAB SWITCHING-------------//
    let mode;

    signInHeader.onclick = () => {
        if (mode === signInHeader) { return; }
        mode = signInHeader;
        loginForm.style.maxHeight = "190px"
        setTimeout(() => {
            signUpHeader.classList.remove("login-header-activated");
            signUpContent.style.display = "none";
            signUpUsername.required = signUpPassword.required = signUpConfirmPassword.required = false;
        
            signInHeader.classList.add("login-header-activated");
            signInContent.style.display = "block";
            signInUsername.required = signInPassword.required = true;

            loginForm.style.maxHeight = "305px";
        }, 200);
    };

    signUpHeader.onclick = () => {
        if (mode === signUpHeader) { return; }
        mode = signUpHeader;
        loginForm.style.maxHeight = "190px"
        setTimeout(() => {
            signInHeader.classList.remove("login-header-activated");
            signInContent.style.display = "none";
            signInUsername.required = signInPassword.required = false;

            signUpHeader.classList.add("login-header-activated");
            signUpContent.style.display = "block";
            signUpUsername.required = signUpPassword.required = signUpConfirmPassword.required = true;

            loginForm.style.maxHeight = "377px";
        }, 200);
    };
    
    signInHeader.onclick();
    
    //-------------SETS UP FORM SUBMIT-------------//
    loginRealForm.onsubmit = () => {
        const request = {};
        let rememberMe;
        if (mode === signInHeader) {
            request.type = "sign-in";
            request.username = signInUsername.value;
            request.password = signInPassword.value;
            rememberMe = signInRememberMe.checked;
        } else if (mode === signUpHeader) {
            request.type = "sign-up";
            request.username = signUpUsername.value;
            request.password = signUpPassword.value;
            rememberMe = signInRememberMe.checked;
        }
        username = request.username;
        password = request.password;
        if (rememberMe) {
            localStorage.setItem(LOGIN_INFO_KEY, JSON.stringify({username: request.username, password: request.password}));
        }
        console.log("request: ",request);
        websocket.send(JSON.stringify(request));
        return false; // To prevent page reload
    }
    //--------------------------------------------------//
}

function setupWebsocket() {
    if (window.location.href.indexOf("jaibel.ddns.net") === -1) {
        websocket = new WebSocket("ws://localhost:4431");
        console.log("connecting to localhost");
    } else {
        websocket = new WebSocket("wss://jaibel.ddns.net/ws/chat");
        console.log("connecting to jaibel servers");
    }

    websocket.onopen = () => {
        if (username && password) {
            websocket.send(JSON.stringify({type: "sign-in", username, password}));
        }
        showLogin();
        online();
    }
    
    websocket.onclose = () => {
        offline();
    }

    websocket.onmessage = data => {
        const response = JSON.parse(data.data);
        // console.log(`Received message: ${data.data}`);
        switch (response.type) {
            case "message": {
                receiveMessage(response.sender, response.content, response.time, username === response.sender);
                break;
            }
            case "sign-in-confirmed": {
                username = response.username;
                updateLoginIndicator(username);
                isLoggedIn = true;
                hideLogin();
                showNotification(`Logged in as ${username}`, "#2ecc71");
                break;
            }
            case "sign-up-confirmed": {
                username = response.username;
                updateLoginIndicator(username);
                isLoggedIn = true;
                hideLogin();
                showNotification(`Created account and logged in as ${username}`, "#2ecc71");
                break;
            }
            case "sign-in-denied": {
                showNotification(`Couldn't sign in: ${response.reason}`, "#e74c3c");
                if (response.reason === BAD_PASSWORD || response.reason === ACCOUNT_NOT_FOUND) {
                    localStorage.removeItem(LOGIN_INFO_KEY);
                    console.log("Unsaved password from localstorage");
                }
                break;
            }
            case "sign-up-denied": {
                showNotification(`Couldn't create account: ${response.reason}`, "#e74c3c");
                if (response.reason === BAD_PASSWORD || response.reason === ACCOUNT_ALREADY_EXISTS) {
                    localStorage.removeItem(LOGIN_INFO_KEY);
                    console.log("Unsaved password from localstorage");
                }
                break;
            }
        }
    };
}

// const receivedMessages = [];

function receiveMessage(person, messageContent, unixEpochTimeMillis, isRight) {
    const messageElement = createMessageElement(person, messageContent, unixEpochTimeMillis, isRight);
    // messages.prepend(messageElement);
    messages.appendChild(messageElement);
    

    const distFromBottom = messages.scrollHeight - messages.clientHeight - messages.scrollTop;
    if (distFromBottom < 400) {
        messages.scrollBy(0, distFromBottom - 20);
    }
}

function send() {
    if (isOnline && isLoggedIn && textArea.value.trim().length) { // If length is zero, it's not "truthy"
        sendButtonPlane.classList.add("send-animation");
        websocket.send(JSON.stringify({type: "message", content: textArea.value}));
        console.log(`sending: ${JSON.stringify({type: "message", content: textArea.value})}`);
        textArea.value = "";
    }
}

function updateLoginIndicator(name) {
    loggedInIndicatorText.style.opacity = "0%";
    setTimeout(() => {
        loggedInIndicatorText.style.opacity = "100%";
        loggedInIndicatorText.innerText = "Logged in as";
        usernameIndicator.innerText = name;
        usernameIndicator.style.opacity = "100%";
        logOutButton.style.opacity = "100%";
    }, 700);
}

function logout() {
    localStorage.removeItem(LOGIN_INFO_KEY);
    window.location.href = window.location.href;
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

let timeOnLastNotification = -Infinity;
function showNotification(message, color) {
    const NOTIFICATION_TIME = 3000;
    const timeDiff = performance.now() - timeOnLastNotification;
    // console.log("Time since last notification: " + timeDiff);

    
    if (timeDiff < NOTIFICATION_TIME) {
        // console.log(`Notification to soon, delaying ${NOTIFICATION_TIME - timeDiff + 800} millis`);
        setTimeout(() => showNotification(message, color), NOTIFICATION_TIME - timeDiff + 800);
        return;
    }

    timeOnLastNotification = performance.now();

    currentlyShowingNotification = true;
    // console.log(`[snowNotifcation message: ${message}, color: ${color}]`);
    notification.innerText = message;
    notification.style.backgroundColor = color;
    notification.style.opacity = "100%";
    notification.style.top = "5%";
    setTimeout(() => {
        notification.style.opacity = "0%";
        notification.style.top = "-6%";
        currentlyShowingNotification = false;
    }, NOTIFICATION_TIME);
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

    loggedInIndicatorText.style.opacity = "0%";
    usernameIndicator.style.opacity = "0%";
    logOutButton.style.opacity = "0%";
    setTimeout(() => {
        loggedInIndicatorText.innerText = "Not logged in";
        loggedInIndicatorText.style.opacity = "100%";
    }, 700);
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