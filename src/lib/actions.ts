"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encryptCryptoBase64 } from "./encryption";
import { addNewPlayer } from "./sql";
import { get } from "@vercel/edge-config";

export async function register(formdata: FormData) {
	const name = formdata.get("name");
	const rollStr = formdata.get("roll");
	const passcode = formdata.get("passkey");

	const curSession = await get("session");
	const allowNew = await get("allowNew");
	const passkey = await get("passkey");

	if (
		!curSession ||
		!passkey ||
		!allowNew ||
		allowNew.toString() !== "true"
	) {
		redirect("/waiting");
	}

	cookies().delete("data");
	cookies().delete("success");
	cookies().delete("success-msg");
	cookies().delete("correct");

	if (
		typeof name !== "string" ||
		typeof rollStr !== "string" ||
		typeof passcode !== "string"
	) {
		redirect("/");
	}

	if (passcode !== passkey.toString().trim()) {
		redirect(
			"/problem?msg=Invalid passcode&sol=Please try again with the correct passcode"
		);
	}

	const roll = parseInt(rollStr, 10);

	const qs = await addNewPlayer(roll, name);

	const data = {
		name,
		roll,
		qs,
		s: curSession?.toString(),
	};

	const encryptedStringBase64 = await encryptCryptoBase64(
		JSON.stringify(data)
	);

	cookies().set("data", encryptedStringBase64, { maxAge: 60 * 60 });

	return redirect(`/logout/clean`);
}
