import { get } from "@vercel/edge-config";
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Waiting() {
	cookies();
	const allowNew = await get("allowNew");
	const curSession = await get("session");
	if (
		curSession &&
		curSession.toString() !== "" &&
		allowNew?.toString() === "true"
	) {
		redirect("/");
	}

	const nextTime = await get("nextTime");

	return (
		<main className="grid place-items-center h-screen">
			<div>
				<h1 className="text-4xl font-bold mb-4 text-blue-500">
					⌚ Waiting
				</h1>
				<p>Please wait till the event starts</p>
				{nextTime && nextTime.toString() && (
					<p className="font-semibold mt-8">
						Expected Start Time:{" "}
						{new Date(nextTime.toString()).toLocaleString(
							undefined,
							{ timeZone: "Asia/Kolkata" }
						)}
					</p>
				)}
			</div>
		</main>
	);
}
