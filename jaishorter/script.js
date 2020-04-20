const $ = (s) => document.querySelector(s);

const longUrlText = $("#long_url");
const shortUrlText = $("#short_url");
const submitButton = $("#url_submit_btn");
const form = $(".shorten-form");
const linkShorter = $(".link-shorter");

const feedbackHeader = $(".error-or-success");
const feedbackMessage = $(".message");
const backBtn = $(".back-btn");
const feedback = $(".feedback");


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

    console.log({shortUrl});
    console.log({longUrl});

    

    console.log(JSON.stringify({shortUrl, longUrl}));

    linkShorter.style.opacity = "0%";

    const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({shortUrl, longUrl})
    }).then(res => res.json());

    if (response.type === "SUCCESS") {
        let devmode = window.location.href.indexOf("jaibel.ddns.net") === -1;
        
        const urlPrefix = devmode ? "localhost" : "jaibel.ddns.net/s";

        const httpPrefix = devmode ? "http://" : "https://";

        const shortLink = `${urlPrefix}/${response.shortUrl}`;
        feedbackHeader.innerText = "Linket blev forkortet!";
        feedbackMessage.innerHTML = `Her er det: <a href=${httpPrefix}${shortLink} target="_blank">${shortLink}</a>` 
    } else if (response.type === "ERROR") {
        feedbackHeader.innerText = "Linket kunne ikke forkortes";

        switch (response.code) {
            case 1: feedbackMessage.innerText = "Det korte link er optaget, prøv et andet."; break;
            case 2: feedbackMessage.innerText = "Linket du vil forkorte kan ikke nåes."; break;
            case 3: feedbackMessage.innerText = "Du må ikke angive et blankt link."; break;
        }


        if (response.code === 1) {
            feedbackMessage.innerText = "Det korte link er optaget, prøv et andet.";
        } else if (response.code === 2) {
            feedbackMessage.innerText = "Linket du vil forkorte kan ikke nåes.";
        } else if (response.code === 3) {
            feedbackMessage.innerText = "Du må ikke angive et blankt link.";
        }


    } else {
        alert("Der skete en fejl, serveren sendte et ukendt svar :-(");
    }

    switchToFeedback();

    console.log("response:", response);
});

function switchToFeedback() {
    linkShorter.style.display = "none";
    feedback.style.display = "block";
    setTimeout(() => {
        feedback.style.opacity = "100%";
    }, 50);
}

function switchToShorter() {
    feedback.style.display = "none";
    linkShorter.style.display = "block";
    setTimeout(() => {
        linkShorter.style.opacity = "100%";
    }, 50);
}

backBtn.onclick = () => {
    feedback.style.opacity = "0%";
    setTimeout(switchToShorter, 300);
}