import fs from "node:fs";

export function allowpath(uid, qid, next) {
	let allocations = JSON.parse(
		fs.readFileSync("src/lib/allocations", "utf-8")
	);

	if (!allocations[uid]) {
		return "Invalid ID";
	}

	let questions = [...allocations[uid][0]];
	questions.splice(0, 1);
	if (!questions.includes(qid)) {
		return "Invalid question";
	}

	return next();
}

// console.log(allowpath(0, 0, () => "Success"));
// console.log(allowpath(0, "qE2", () => "Success"));
// console.log(allowpath(0, "qE1", () => "Success"));
