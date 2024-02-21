import { get } from "@vercel/edge-config";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Success() {
	const session = await get("session");
	if (!session) {
		cookies().delete("data");
		redirect("/waiting");
	}

	if (!cookies().get("success")) {
		redirect("/clue/1");
	}

	const success = cookies().get("success")?.value || "";
	if (!success || success !== "true") {
		return (
			<main className="grid h-screen place-items-center">
				<div>
					<h1 className="text-4xl mb-4">
						Well tried, but you are not supposed to be here
					</h1>
					<Link
						className="text-cyan-200 px-6 py-2 bg-cyan-900 hover:bg-cyan-800 transition rounded-md"
						href="/clue/1"
					>
						Go back to clues
					</Link>
				</div>
			</main>
		);
	}
	return (
		<main className="grid h-screen place-items-center">
			<div>
				<h1 className="text-4xl">Success! You have cracked it!</h1>
				<Link
					className="text-yellow-400 underline underline-offset-4"
					href="/leaderboard"
				>
					View Leaderboard
				</Link>
			</div>
		</main>
	);
}
