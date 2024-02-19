// HTML canvas element
const canvas = document.getElementById("what");
const ctx = canvas.getContext("2d");

// Set the canvas size
canvas.width = 300;
canvas.height = 300;
canvas.style.border = "1px solid black";

// Draw an image
const img = new Image();
img.src =
	"https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
img.width = 100;
img.height = 100;
img.onload = function () {
	ctx.drawImage(img, 10, 10);
	ctx.fillStyle = "red";
	ctx.fillRect(20, 20, 100, 100);

	const img2 = new Image();
	img2.src =
		"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
	img2.width = 100;
	img2.height = 100;
	img2.style = "width: 100px; height: 100px;";
	img2.onload = function () {
		ctx.drawImage(img2, -20, -20);
	};

	const img3 = new Image();
	img3.src =
		"https://images.unsplash.com/photo-1588580000645-4562a6d2c839?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
	img3.width = 100;
	img3.height = 100;
	img3.style = "width: 100px; height: 100px;";
	img3.onload = function () {
		ctx.drawImage(img3, -200, -200);
	};
};

function func() {
	ctx.fillStyle = "#14213d77";
	ctx.fillRect(0, 0, 300, 300);
	ctx.font = "30px Arial";
	ctx.fillStyle = "#fca311";
	ctx.fillText("Maybe adjust me? What's on that book?", 10, 150);
	ctx.fillText(
		"I'm a bit off the screen ... ... The art of ____ Programming",
		10,
		200
	);
}
