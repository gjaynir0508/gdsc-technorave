"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encryptCryptoBase64 } from "./encryption";
import { addNewPlayer } from "./sql";

export async function register(formdata: FormData) {
	const name = formdata.get("name");
	const rollStr = formdata.get("roll");

	if (typeof name !== "string" || typeof rollStr !== "string") {
		redirect("/");
	}

	const roll = parseInt(rollStr, 10);

	const qs = await addNewPlayer(roll, name);

	const data = {
		name,
		roll,
		qs,
	};

	const encryptedStringBase64 = await encryptCryptoBase64(
		JSON.stringify(data)
	);

	cookies().set("data", encryptedStringBase64, { maxAge: 60 * 60 });

	return redirect(`/q/${qs[1]}`);
}
