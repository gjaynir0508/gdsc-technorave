import fs from "fs";
import path from "path";

export function registerPlayer(roll: number): number {
	const players = JSON.parse(
		fs.readFileSync(path.resolve("src/lib/players.json")).toString()
	);
	if (Object.values(players).includes(roll)) {
		throw new Error("Player already exists");
	}
	const curLen = Object.keys(players).length;
	players[curLen] = roll;
	fs.writeFileSync(
		path.resolve("src/lib/players.json"),
		JSON.stringify(players)
	);
	return curLen;
}
