import React from "react";
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";
import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";

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

export const metadata = {
	title: "LeaderBoard - GDSC Digital Odyssey",
};

export default async function LeaderBoard() {
	unstable_noStore();
	const session = await get("session");
	if (!session) {
		redirect("/waiting");
	}
	const data =
		await sql`SELECT id, roll, name, starttime, endtime FROM s1 WHERE length(endtime) > 0`;
	console.log("reached here");
	const sorted = data.rows.sort((a, b) => {
		return (
			new Date(a.endtime).getTime() -
			new Date(a.starttime).getTime() -
			(new Date(b.endtime).getTime() - new Date(b.starttime).getTime())
		);
	});

	return (
		<main className="grid place-items-center h-screen p-32">
			<div>
				<h1 className="text-3xl font-bold mb-8">🏆 LeaderBoard</h1>
				<table className="bg-stone-800 bg-opacity-40">
					<thead>
						<tr className="bg-stone-800 border-b-2 border-b-orange-300">
							<th align="left" className="p-4 px-8">
								#Rank
							</th>
							<th className="p-4">Roll</th>
							<th className="p-4">Name</th>
							<th align="left" className="p-4">
								Time
							</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map((player, index) => {
							return (
								<tr
									className={`${
										index == 0
											? "bg-[#fca311] text-black font-semibold"
											: index == 1
											? "!bg-[#415a77] "
											: index == 2
											? "bg-[#8a5a44]"
											: "even:bg-zinc-700"
									}`}
									key={player.id}
								>
									<td className="p-4 px-8 relative">
										{index < 3 && (
											<span className="absolute left-[-20%] top-2 bg-gray-900 text-xl bg-opacity-70 rounded-full p-2 backdrop-blur-md">
												{index === 0
													? "🥇"
													: index === 1
													? "🥈"
													: index === 2
													? "🥉"
													: " "}{" "}
											</span>
										)}
										{index + 1}
									</td>
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
