"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
	useEffect(() => {
		localStorage.removeItem("savedValues");
		redirect("/");
	});
	return (
		<main className="grid place-items-center w-screen h-screen">
			<h1 className="text-3xl">Logging out...</h1>
		</main>
	);
}
