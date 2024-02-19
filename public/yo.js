function something() {
	console.log("hmm maybe somethingElse?");
}

let c = 0;

function somethingElse() {
	if (c < 1) {
		console.log("maybe somethingElse?");
		c++;
		return;
	}
	const div = document.createElement("div");
	div.innerHTML =
		"<span style='color: #3334'>T</span>o pass something to a JS function <!-- without having to write it in the call statement -->, you _ _ _ _ it.";
	div.style = "color: #f0f0f0; font-size: 20px";
	console.log("maybe something?");
	document.body.appendChild(div);
}
