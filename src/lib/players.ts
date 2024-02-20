import { sql } from "@vercel/postgres";

export async function registerPlayer(roll: number, name: string) {
	// const players = JSON.parse(
	// 	fs.readFileSync(path.resolve("src/lib/players.json")).toString()
	// );
	// if (Object.values(players).includes(roll)) {
	// 	throw new Error("Player already exists");
	// }
	// const curLen = Object.keys(players).length;
	// players[curLen] = roll;
	// fs.writeFileSync(
	// 	path.resolve("src/lib/players.json"),
	// 	JSON.stringify(players)
	// );
	// return curLen;
	const registered = await sql`SELECT * FROM s1players WHERE roll = ${roll}`;
	if (registered.rowCount > 0) {
		throw new Error("Player already exists");
	}
	const players = await sql`SELECT * FROM s1players`;
	const curLen = players.rowCount;
}
