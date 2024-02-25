import { decryptCryptoBase64 } from "@/lib/encryption";
import { get } from "@vercel/edge-config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await get("session");
	if (!session) {
		cookies().delete("data");
		redirect("/waiting");
	}

	const data = request.cookies.get("data");
	if (!data) {
		redirect("/");
	}

	let parsed;
	try {
		const decrypted = await decryptCryptoBase64(data.value);
		parsed = JSON.parse(decrypted);
	} catch (e) {
		console.log("Here, deleting cookie...");
		cookies().delete("data");
		revalidatePath("/");
		redirect("/");
	}
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
