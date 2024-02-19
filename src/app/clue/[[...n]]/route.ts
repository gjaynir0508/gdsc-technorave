import { decryptCryptoBase64 } from "@/lib/encryption";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const data = request.cookies.get("data");
	if (!data) {
		redirect("/");
	}

	const decrypted = await decryptCryptoBase64(data.value);
	const parsed = JSON.parse(decrypted);
	const qs = parsed.qs;
	const iStr = request.nextUrl.pathname.split("/").pop();
	try {
		Number(iStr);
	} catch (e) {
		redirect("/");
	}

	const i = Number(iStr);
	if (i < 1 || i > 3) {
		redirect(`/q/${qs[1]}`);
	}

	redirect(`/q/${qs[i]}`);
}
