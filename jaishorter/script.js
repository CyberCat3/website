const $ = (s) => document.querySelector(s);

const longUrlText = $("#long_url");
const shortUrlText = $("#short_url");
const submitButton = $("#url_submit_btn");
const form = $(".shorten-form");
const linkShorter = $(".link-shorter");

const feedback = $(".feedback");
const loader = $(".feedback .loader");
const feedbackTitle = $(".feedback-title");
const feedbackMessage = $(".feedback-message");
const closeBtn = $(".feedback-close-btn");

const sleep = (millis) => new Promise(r => setTimeout(r, millis));

async function closeFeedback() {
    feedback.style.opacity = "0%";
    feedback.style.pointerEvents = "none";
    await sleep(200);
    feedback.style.display = "none";
}

function openFeedback() {
    feedback.style.display = "block";
    loader.style.display = "block";
    loader.style.opacity = "100%";
    [feedbackTitle, feedbackMessage, closeBtn].forEach(n => {
        n.style.display = "none";
        n.style.opacity = "0%";
    });
    feedback.style.pointerEvents = "all";
    sleep(0).then(() => feedback.style.opacity = "100%");
}

async function populateFeedback(title, message) {
    loader.style.opacity = "0%";
    await sleep(400);
    loader.style.display = "none";
    feedbackTitle.innerHTML = title;
    feedbackMessage.innerHTML = message;
    Promise.all([feedbackMessage, feedbackTitle, closeBtn].map(async fb => {
        fb.style.display = "block";
        await sleep(50);
        fb.style.opacity = "100%";
    }));
}

async function fakeServerResponse() {
    await sleep(5000);
    return {type: "SUCCESS", shortUrl: "hejmeddig"};
}

const validateInputHandler = e => {
    const valid = longUrlText.value.length && shortUrlText.value.length;

    submitButton.disabled = !valid;

    submitButton.style.backgroundColor = valid
        ? "rgba(253, 121, 168, 0.8)" : "rgba(253, 121, 168, 0.3)";
}
longUrlText.addEventListener("input", validateInputHandler);
shortUrlText.addEventListener("input", validateInputHandler);

submitButton.addEventListener("click", async e => {
    e.preventDefault();

    const shortUrl = shortUrlText.value;
    let longUrl = longUrlText.value;

    console.log(JSON.stringify({shortUrl, longUrl}));

    openFeedback();

    let response;

    try {
        response = await /*fakeServerResponse();*/ fetch("/s/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({shortUrl, longUrl})
        }).then(res => res.json());
    } catch (e) {
        console.error(e);
        closeFeedback();
        return;
    }

    let title, message;
    
    if (response.type === "SUCCESS") {
        let devmode = window.location.href.indexOf("jaibel.ddns.net") === -1;
        
        const urlPrefix = devmode ? "localhost" : "jaibel.ddns.net/s";

        const httpPrefix = devmode ? "http://" : "https://";

        const shortLink = `${urlPrefix}/${response.shortUrl}`;

        title = "Linket blev forkortet!";
        message = `Her er det: <a href=${httpPrefix}${shortLink} target="_blank">${shortLink}</a>`;
    } else if (response.type === "ERROR") {
        title = "Linket kunne ikke forkortes"

        switch (response.code) {
            case 1: message = "Det korte link er optaget, prøv et andet."; break;
            case 2: message = "Linket du vil forkorte kan ikke nåes."; break;
            case 3: message = "Du må ikke angive et blankt link."; break;
        }

    } else {
        alert("Der skete en fejl, serveren sendte et ukendt svar :-(");
        closeFeedback();
    }

    populateFeedback(title, message);

    console.log("response:", response);
});