import Link from "next/link";

export default function NotFound() {
	return (
		<main className="grid place-items-center w-screen h-screen">
			<div>
				<h2 className="text-2xl font-bold mb-6">
					404 - Page Not Found
				</h2>
				<p>Could not find requested resource</p>
				<Link
					className="bg-slate-600 px-6 py-2 mt-8 rounded-md inline-block text-white hover:bg-slate-500 transition-all"
					href="/"
				>
					Return Home
				</Link>
			</div>
		</main>
	);
}
