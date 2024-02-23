import fs from "node:fs";
import path from "node:path";

function shuffle(array: any[]) {
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

export function createCombinationsForSet(set: string) {
	const qA = JSON.parse(
		fs.readFileSync(path.resolve(`src/questions/${set}/qa.json`)).toString()
	) as { [key: string]: string };

	const { l1, l2, l3 } = JSON.parse(
		fs
			.readFileSync(path.resolve(`src/questions/${set}/qdiv.json`))
			.toString()
	) as { l1: string[]; l2: string[]; l3: string[] };

	let combinations = [];
	let passcodes = [];
	let index = 0;
	for (let i = 0; i < l1.length; i++) {
		for (let j = 0; j < l2.length; j++) {
			for (let k = 0; k < l3.length; k++) {
				combinations.push([index, l1[i], l2[j], l3[k]]);
				index++;
			}
		}
	}

	// shuffle the combinations
	combinations = shuffle(combinations);
	combinations = shuffle(combinations);

	// re-number the combinations
	for (let i = 0; i < combinations.length; i++) {
		combinations[i][0] = i;
	}

	// create passcodes
	for (let i = 0; i < combinations.length; i++) {
		passcodes.push(
			`${qA[combinations[i][1]]}-${qA[combinations[i][2]]}-${
				qA[combinations[i][3]]
			}`
		);
	}

	// write the combinations and passcodes to files
	fs.writeFileSync(
		path.resolve(`src/questions/${set}/combinations.json`),
		JSON.stringify(combinations)
	);

	fs.writeFileSync(
		path.resolve(`src/questions/${set}/passcodes.json`),
		JSON.stringify(passcodes)
	);
}

export function createCombinations(sets: string[]) {
	for (const set of sets) {
		try {
			createCombinationsForSet(set);
		} catch (e) {
			console.log("Error in creating combinations for set", set);
			console.error(e);
		}
	}
}

export function createCombinationsForAllSets() {
	const setDirs = fs
		.readdirSync(path.resolve("src/questions"), { withFileTypes: true })
		.filter((f) => f.isDirectory())
		.map((f) => f.name);

	for (const set of setDirs) {
		try {
			createCombinationsForSet(set);
		} catch (e) {
			console.log("Error in creating combinations for set", set);
			console.error(e);
		}
	}
}
