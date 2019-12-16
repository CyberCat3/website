function setupButton() {
    let header = document.getElementsByTagName("h1")[0];
    let button = document.getElementsByTagName("button")[0];
    button.style = "float: left; margin-right: 10px; width: 80px; height: " + header.clientHeight + "px;";
    console.log("setupButton");
}

function generateTable(table, csv) {
    let html = [];
    
    let lines = csv.split(/\n/);

    for (let i = 0; i < lines.length; ++i) {
        let line = lines[i];

        html.push("<tr>");

        let elements = line.split(/,/);

        for (let j = 0; j < elements.length; ++j) {
            let element = elements[j];

            if (i == 0) { 
                html.push("<th>");
                html.push(element.charAt(0).toUpperCase() + element.substring(1));
                html.push("</th>"); 
            } else {
                html.push("<td>");
                if (j >= 4) {
                    html.push("<a target=\"display\" href=\"" + elements[0] + "/" + element + "\">");
                }
                html.push(element);
                if (j >= 4) {
                    html.push("</a>");
                }
                html.push("</td>");
            }
        }

        html.push("</tr>");
    }

    // for (let line of csv.split(/\n/)) {
    //     html.push("<tr>");
    //     for (let element of line.split(/,/)) {
    //         html.push("<td>" + element + "</td>");
    //     }
    //     html.push("</tr>");
    // }

    table.innerHTML = html.join("");
}

function getAJAX(url, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
  request.open("GET", url, true);
  request.send();
}

getAJAX("index.csv", (csv) => {
    csv = csv.responseText;
    console.log(csv);
    let table = document.getElementById("table");
    let iframe = document.getElementsByName("display")[0];
    generateTable(table,csv);
    iframe.width = table.clientWidth;
});

window.onload = function () {
    setupButton();
}