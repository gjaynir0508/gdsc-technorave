"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Problem() {
	const params = useSearchParams();
	const router = useRouter();
	const msg = params.get("msg");
	const sol = params.get("sol");
	if (!msg || !sol) {
		redirect("/");
	}
	return (
		<main className="bg-cyan-200 bg-opacity-25 h-screen grid place-items-center">
			<div className="flex flex-col gap-4 justify-end">
				<h2 className="text-md mb-8 italic">
					⚠️ Uh Oh! An Error Occurred.
				</h2>
				<h1 className="text-3xl font-bold">✉️ {msg}</h1>
				<h3 className="text-2xl font-semibold">🦉 {sol}</h3>
				<div className="flex gap-4 mt-8">
					<button
						onClick={
							// Attempt to recover by trying to re-render the segment
							() => router.push("/")
						}
						className="bg-slate-500 text-white px-8 py-2 rounded-md"
					>
						Try again
					</button>
				</div>
			</div>
		</main>
	);
}
