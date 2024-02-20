"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	return (
		<main className="bg-red-200 bg-opacity-25 h-screen grid place-items-center">
			<div className="flex flex-col gap-4 justify-end">
				<h2 className="text-xl">⚠️ Uh Oh! An Error Occurred.</h2>
				<h3 className="text-3xl font-bold">{error.message}</h3>
				<div className="flex gap-4">
					<button
						onClick={
							// Attempt to recover by trying to re-render the segment
							() => reset()
						}
						className="bg-slate-500 text-white px-8 py-2 rounded-md"
					>
						Try again
					</button>
					<button
						onClick={
							// Attempt to recover by trying to re-render the segment
							() => router.back()
						}
						className="bg-red-600 text-white px-8 py-2 rounded-md"
					>
						Go Back
					</button>
				</div>
			</div>
		</main>
	);
}
