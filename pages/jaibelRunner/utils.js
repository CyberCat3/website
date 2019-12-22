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