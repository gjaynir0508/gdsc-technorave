import { decryptCryptoBase64 } from "@/lib/encryption";
import { validatePasscode } from "@/lib/sql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.formData();
	const part1 = body.get("part1");
	const part2 = body.get("part2");
	const part3 = body.get("part3");

	const passcode = `${part1}-${part2}-${part3}`;

	const data = request.cookies.get("data");
	if (!data) {
		redirect("/");
	}
	const decrypted = await decryptCryptoBase64(data.value);
	const parsed = JSON.parse(decrypted);
	const qs = parsed.qs;
	const index = qs[0];

	const res = await validatePasscode(index, passcode);
	if (res === "Invalid ID") {
		request.cookies.delete("data");
		redirect("/");
	} else if (res === "Invalid passcode") {
		redirect(`/q/${qs[3]}`);
	} else {
		revalidatePath("/leaderboard");
		request.cookies.delete("data");
		redirect(`/success`);
	}
}
