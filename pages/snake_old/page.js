window.onload = function() {
	let header = document.getElementsByTagName("h1")[0];
	let button = document.getElementsByTagName("button")[0];
    button.style = "float: left; margin-right: 10px; width: 80px; height: " + header.clientHeight + "px;";
}