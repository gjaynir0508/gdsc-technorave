import React from "react";
import fs from "node:fs";

export default function LeaderBoard() {
	const allocated = JSON.parse(
		fs.readFileSync("src/lib/allocations.json").toString()
	);
	const players = JSON.parse(
		fs.readFileSync("src/lib/players.json").toString()
	);
	const sorted = Object.values(allocated).sort((a: any, b: any) => {
		if (a[3] === "" && b[3] === "") {
			return 0;
		} else if (a[3] === "" && b[3] !== "") {
			return 1;
		} else if (a[3] !== "" && b[3] === "") {
			return -1;
		}
		return b[3] - a[3];
	});
	return (
		<div>
			<h1>LeaderBoard</h1>
			<ul>
				{sorted.map((a: any, i: number) => {
					return (
						<li key={i}>
							{a[0][0]} - {players[a[0][0]]} -{" "}
							{a[3] === ""
								? "Not completed"
								: new Date(a[3]).toLocaleString()}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
