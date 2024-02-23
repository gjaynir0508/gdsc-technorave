import { register } from "@/lib/actions";
import { get } from "@vercel/edge-config";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitBtn from "./SubmitBtn";

export default async function Home() {
	const loggedIn = cookies().get("data") !== undefined;
	const curSession = await get("session");
	if (!curSession) {
		redirect("/waiting");
	}

	const allowNew = await get("allowNew");
	if (allowNew?.toString() !== "true") {
		redirect("/waiting");
	}

	return (
		<main className="grid w-screen h-screen place-items-center bg-gradient-to-tr bg-gray-700 from-cyan-500 to-blue-500 bg-blend-multiply">
			{loggedIn ? (
				<div>
					<h1 className="text-2xl mb-4">
						Hey, here are your clues, click on them to go to
						respective pages.
					</h1>
					<div className="flex gap-4 justify-center">
						<Link
							className="bg-gradient-to-br from-cyan-400 to-blue-400 text-white px-8 py-2"
							href="/clue/1"
						>
							Clue 1
						</Link>
						<Link
							className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white px-8 py-2"
							href="/clue/2"
						>
							Clue 2
						</Link>
						<Link
							className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-8 py-2"
							href="/clue/3"
						>
							Clue 3
						</Link>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-9 p-unit-lg bg-opacity-50 backdrop-blur-md rounded">
					<h1 className="text-4xl font-bold">
						Welcome to the TechnoRave Round 1: Digital Odyssey
					</h1>
					<form
						className="flex gap-4 min-w-full justify-center"
						action={register}
					>
						<input
							type="text"
							name="name"
							placeholder="Enter your name"
							autoComplete="off"
							required
							className="p-unit-sm rounded-sm text-gray-900 outline-none focus:ring-4 focus:ring-blue-500"
						/>
						<input
							type="nmber"
							name="roll"
							placeholder="Enter your full roll number"
							autoComplete="off"
							required
							className="p-unit-sm rounded-sm text-gray-900 outline-none focus:ring-4 focus:ring-blue-500"
						/>
						{!loggedIn && <SubmitBtn />}
					</form>
				</div>
			)}
		</main>
	);
}

