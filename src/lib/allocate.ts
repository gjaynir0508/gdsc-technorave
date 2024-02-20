import { sql } from "@vercel/postgres";

export async function allocate(index: number) {
	// const state = JSON.parse(fs.readFileSync("src/lib/state.json").toString());
	// if (index < 0 || index >= combinations.length) {
	// 	return "Invalid index";
	// }

	// if (state.length > 0 && state[index][0] === 1) {
	// 	return "Already allocated";
	// }

	// state[index] = [1, 0];
	// fs.writeFileSync("src/lib/state.json", JSON.stringify(state));
	// const allocations = JSON.parse(fs.readFileSync("src/lib/allocations.json").toString());
	// allocations[index] = [combinations[index], passcodes[index], new Date().toISOString(), ""];
	// fs.writeFileSync("src/lib/allocations.json", JSON.stringify(allocations));

	// return combinations[index];
	const p = await sql`SELECT roll FROM s1players WHERE id = ${index}`;
	if (p.rowCount > 0) {
		throw new Error("Index " + index + " is already allocated");
	}
	const qs = await sql`SELECT * FROM s1qs WHERE id = ${index}`;
	const q = qs.rows[0];
	await sql`INSERT INTO s1players (id, roll) VALUES (${index}, ${q.roll})`;
}

// console.log(allocate(0));
