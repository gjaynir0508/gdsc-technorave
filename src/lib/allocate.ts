import fs from "node:fs";

import combinations from "@/lib/combinations.json" with {type: "json"};
import passcodes from "@/lib/passcodes.json" with {type: "json"};

export function allocate(index: number) {
	const state = JSON.parse(fs.readFileSync("src/lib/state.json").toString());
	if (index < 0 || index >= combinations.length) {
		return "Invalid index";
	}

	if (state.length > 0 && state[index][0] === 1) {
		return "Already allocated";
	}

	state[index] = [1, 0];
	fs.writeFileSync("src/lib/state.json", JSON.stringify(state));
    const allocations = JSON.parse(fs.readFileSync("src/lib/allocations.json").toString());
    allocations[index] = [combinations[index], passcodes[index], new Date().toISOString(), ""];
    fs.writeFileSync("src/lib/allocations.json", JSON.stringify(allocations));

	return combinations[index];
}


// console.log(allocate(0));
