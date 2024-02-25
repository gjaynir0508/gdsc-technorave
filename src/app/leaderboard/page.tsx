import React from "react";
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";
import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";
import Link from "next/link";

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
		await sql`select id, roll, name, time, progress, score, starttime from s1 
				where roll > 0
				order by score desc, progress desc, time asc, starttime asc`;

	const sorted = data.rows;

	return (
		<main className="grid place-items-center h-screen p-32 overflow-x-hidden bg-gradient-radial from-slate-800 to-slate-900">
			<div>
				<h1 className="text-3xl font-bold p-8 sticky top-6 z-20">
					🏆 LeaderBoard
				</h1>
				<div className="fixed top-0 left-0 w-[98vw] h-[17.6rem] bg-gradient-radial from-[#1a2537] to-[#172133] bg-bottom z-10"></div>
				<table className="bg-stone-800 bg-opacity-40">
					<thead className="sticky top-[6.3rem] z-20 bg-black w-full">
						<tr className="bg-stone-800 border-b-2 border-b-orange-300">
							<th align="left" className="p-4 px-8">
								#Rank
							</th>
							<th className="p-4">Roll</th>
							<th className="p-4">Name</th>
							<th align="left" className="p-4">
								Time
							</th>
							<th className="p-4">Score (max. 10)</th>
							<th className="p-4">Progress</th>
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
										{player.progress === 3
											? msToTime(parseInt(player.time))
											: `⏱️ (${msToTime(
													Date.now() -
														new Date(
															player.starttime
														).getTime()
											  )})`}
									</td>
									<td className="p-4">{player.score}</td>
									<td className="p-4">
										{player.progress === 3
											? "Completed"
											: player.progress === 2
											? "2/3"
											: player.progress === 1
											? "1/3"
											: "0/3"}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="fixed bottom-0 right-0 p-8">
				<Link
					className="bg-red-700 hover:bg-red-900 text-white px-8 py-2 transition-all rounded-md"
					href="/logout/clear"
				>
					Logout
				</Link>
			</div>
		</main>
	);
}
