for (let horibar of document.getElementsByClassName("horiBar")) {
	for (let child of horibar.children) {
		child.style="width:" + 100 / horibar.children.length + "%;";
	}
}

var backgroundIsJaibel = false;
var jaibelWidth;
var jaibelHeight;
var jaibelRotate = 0;

function fizzBuzz() {
	var dividers = [
		{dividor: 3, word: "Fizz"},
		{dividor: 5, word: "Buzz"}
	];
	
	for (let i = 1; i <= 100; ++i) {
		var output = "";
		for (let j = 0; j < dividers.length; ++j)
		if (i % dividers[j].dividor == 0) output += dividers[j].word;
		if (output === "") output = i;
		console.log(output);		
	}
}

function jaibelGround() {
	var c = document.getElementsByTagName('body');
	for (let i = 0; i < c.length; ++i) {
		if (backgroundIsJaibel)
			c[i].style = "background-image: url('https://images.wallpaperscraft.com/image/black_background_texture_86812_300x168.jpg')"
		else
			c[i].style = "background-image: url('/image/Jaibel.gif')";
	}
	backgroundIsJaibel = !backgroundIsJaibel;
	console.log(backgroundIsJaibel ? "Switched background to a gif of Jaibel" : "Switched to regular background");
}

function rotateJaibel() {
	var j = document.getElementById("jaibelImage");
	jaibelWidth = j.width;
	jaibelHeight = j.height;

	jaibelRotate += 90;
	j.style.transform = "rotate("+jaibelRotate+"deg)";
	console.log(j.style.transform);
//	j.style.transform = "scale: (1.05,1.05)";

}