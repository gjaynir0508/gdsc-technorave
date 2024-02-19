import Link from "next/link";
import React from "react";

export default function Success() {
	return (
		<div>
			<h1>Success! You have cracked it!</h1>
			<Link className="text-yellow-400" href="/leaderboard">
				View Leaderboard
			</Link>
		</div>
	);
}
