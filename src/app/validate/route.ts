import { decryptCryptoBase64 } from "@/lib/encryption";
import { validate } from "@/lib/validate";
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

	const res = validate(passcode, index);
	if (res === "Invalid ID") {
		redirect("/");
		request.cookies.delete("data");
	} else if (res === "Invalid passcode") {
		redirect(`/q/${qs[3]}`);
	} else {
		redirect(`/success`);
	}
}
