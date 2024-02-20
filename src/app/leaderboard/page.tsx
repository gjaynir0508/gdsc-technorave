import React from "react";
import { sql } from "@vercel/postgres";

function msToTime(duration: number) {
	let milliseconds: number | string = Math.floor((duration % 1000) / 100),
		seconds: number | string = Math.floor((duration / 1000) % 60),
		minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
		hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	return (
		hours + " h:" + minutes + " m:" + seconds + " s." + milliseconds + " ms"
	);
}

export default async function LeaderBoard() {
	const data =
		await sql`SELECT id, roll, name, starttime, endtime FROM s1 WHERE length(endtime) > 0`;
	const sorted = data.rows.sort((a, b) => {
		return (
			new Date(a.endtime).getTime() -
			new Date(a.starttime).getTime() -
			(new Date(b.endtime).getTime() - new Date(b.starttime).getTime())
		);
	});

	return (
		<main className="grid place-items-center h-screen">
			<div>
				<h1>LeaderBoard</h1>
				<table className="bg-stone-800">
					<tr className="border-b-2 border-b-orange-300">
						<th align="left" className="p-4 px-8">
							#Rank
						</th>
						<th className="p-4">Roll</th>
						<th className="p-4">Name</th>
						<th align="left" className="p-4">
							Time
						</th>
					</tr>
					<tbody>
						{sorted.map((player, index) => {
							return (
								<tr
									className="even:bg-zinc-700 first-of-type:bg-yellow-600"
									key={player.id}
								>
									<td className="p-4 px-8">{index + 1}</td>
									<td className="p-4">{player.roll}</td>
									<td className="p-4">{player.name}</td>
									<td align="left" className="p-4">
										{msToTime(
											new Date(player.endtime).getTime() -
												new Date(
													player.starttime
												).getTime()
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</main>
	);
}
