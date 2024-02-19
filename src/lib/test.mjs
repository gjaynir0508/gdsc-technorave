import fs from "node:fs";

import { a } from "./q.mjs";

const easy = ["qE1", "qE2", "qE3", "qE4"];
const medium = ["qM1", "qM2", "qM3"];
const hard = ["qH1", "qH2", "qH3"];

let combinations = [];
let passcodes = [];
let index = 0;
for (let i = 0; i < easy.length; i++) {
	for (let j = 0; j < medium.length; j++) {
		for (let k = 0; k < hard.length; k++) {
			combinations.push([index, easy[i], medium[j], hard[k]]);
			index++;
		}
	}
}

// shuffle the combinations
function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

// shuffle the combinations
combinations = shuffle(combinations);
combinations = shuffle(combinations);

// re-number the combinations
for (let i = 0; i < combinations.length; i++) {
	combinations[i][0] = i;
}

for (let i = 0; i < combinations.length; i++) {
	passcodes.push(
		`${a[combinations[i][1]]}-${a[combinations[i][2]]}-${
			a[combinations[i][3]]
		}`
	);
}

console.log(combinations, combinations.length);
console.log(passcodes, passcodes.length);

fs.writeFileSync("src/lib/combinations.json", JSON.stringify(combinations));
fs.writeFileSync("src/lib/passcodes.json", JSON.stringify(passcodes));
