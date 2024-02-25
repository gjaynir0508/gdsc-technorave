import { decryptCryptoBase64 } from "@/lib/encryption";
import { validatePasscode } from "@/lib/sql";
import { get } from "@vercel/edge-config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	if (cookies().get("success")?.value === "true") {
		redirect("/success");
	}

	const session = await get("session");
	if (!session) {
		cookies().delete("data");
		await new Promise((resolve) => () => setTimeout(resolve, 200));
		redirect("/waiting");
	}

	const body = await request.formData();
	const part1 = body.get("part1")?.toString().trim().toLowerCase();
	const part2 = body.get("part2")?.toString().trim().toLowerCase();
	const part3 = body.get("part3")?.toString().trim().toLowerCase();

	if (!part1 || !part2 || !part3) {
		redirect("/clue/3");
	}

	const passcode = `${part1}-${part2}-${part3}`;

	const data = request.cookies.get("data");
	if (!data) {
		redirect("/");
	}

	let parsed;
	try {
		const decrypted = await decryptCryptoBase64(data.value);
		parsed = JSON.parse(decrypted);
	} catch (e) {
		cookies().delete("data");
		await new Promise((resolve) => () => setTimeout(resolve, 200));
		redirect("/");
	}
	const qs = parsed.qs;
	const index = qs[0];

	const res = await validatePasscode(index, passcode);
	if (res === "Invalid ID") {
		cookies().delete("data");
		redirect("/");
	} else if (res === "Invalid passcode") {
		redirect(`/q/${qs[3]}`);
	} else if (res === "Already completed") {
		cookies().delete("data");
		cookies().set("success", "true");
		cookies().set(
			"success-msg",
			"You have already completed the game. (This attempt was also correct :))"
		);
		redirect("/success");
	} else {
		revalidatePath("/leaderboard");
		cookies().delete("data");
		cookies().set("success", "true");
		redirect(`/success`);
	}
}
