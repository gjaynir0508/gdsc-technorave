import Link from "next/link";
import React from "react";

export default function Success() {
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
