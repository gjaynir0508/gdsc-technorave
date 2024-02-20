import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";
import React from "react";

export default async function Waiting() {
	const curSession = await get("session");
	if (curSession) {
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
						{new Date(nextTime.toString()).toLocaleString()}
					</p>
				)}
			</div>
		</main>
	);
}
