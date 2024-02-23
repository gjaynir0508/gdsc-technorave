import { sql } from "@vercel/postgres";
import fs from "node:fs";
import path from "node:path";

export async function pushQuestions(set: string) {
	const combinations = JSON.parse(
		fs
			.readFileSync(
				path.resolve(`src/questions/${set}/combinations.json`)
			)
			.toString()
	);
	const passcodes = JSON.parse(
		fs
			.readFileSync(path.resolve(`src/questions/${set}/passcodes.json`))
			.toString()
	);
	const starttime = new Date().toISOString();
	for (let i = 0; i < combinations.length; i++) {
		const q = combinations[i];
		await sql`INSERT INTO s1 (id, clue1, clue2, clue3, passcode, starttime) VALUES (${q[0]}, ${q[1]}, ${q[2]}, ${q[3]}, ${passcodes[i]}, ${starttime})`;
	}
}

export async function clearTableWithBackup(set: string) {
	await sql`DROP TABLE ${set}_copy`;
	await sql`CREATE TABLE ${set}_copy AS TABLE s1`;
	await sql`DELETE FROM s1`;
}
