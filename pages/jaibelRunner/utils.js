let imagesLoading = 0;

function smartImageLoad(img) {
	let loadingDiv = document.getElementById("p5_loading");
	let loadingHeader = document.createElement("h3");
	loadingHeader.innerText = `Loading ${img}...`;
	++imagesLoading;
	loadingDiv.appendChild(loadingHeader);
	return loadImage(img, () => {
		loadingHeader.innerText = `Loaded ${img}!`;
		setTimeout(() => {
			if (--imagesLoading === 0) {
				reset();
				loadingDiv.hidden = true;
			}
		}, 100);
	});
}

function funkyText(input, size, r, g, b, inCenter) {
	textAlign(inCenter ? CENTER : LEFT, TOP);
	textSize(size);
	fill(0);
    noStroke();

    let x = inCenter ? WIDTH / 2 : 7;
    let y = inCenter ? HEIGHT / 2 - 50 : 7;

	text(input, x + 2, y + 2);
	fill(r,g,b);
	text(input, x, y);
}

console.log("utils.js loaded");