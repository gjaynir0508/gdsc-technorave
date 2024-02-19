import fs from "node:fs";

import allocations from "@/lib/allocations.json" with {type: "json"};

export function validate(passcode, id) {
	if (!(allocations[id])) {
        return "Invalid ID";
    }

    if (allocations[id][1] !== passcode.toLowerCase().trim()) {
        return "Invalid passcode";
    }

    allocations[id][3] = new Date().toISOString();
    fs.writeFileSync("src/lib/allocations.json", JSON.stringify(allocations));

    return "Success";
}


// console.log(validate("1234", 0));
// console.log(validate("gdsc-recursion-bind", 0));
