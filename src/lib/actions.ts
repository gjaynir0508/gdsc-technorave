"use server";

import { cookies } from "next/headers";
import { allocate } from "./allocate";
import { registerPlayer } from "./players";
import { redirect } from "next/navigation";
import { encryptCryptoBase64 } from "./encryption";

export async function register(formdata: FormData) {
	const name = formdata.get("name");
	const roll = formdata.get("roll");

	let index: number;
	try {
		index = registerPlayer(Number(roll));
		console.log(
			`Registered ${name} with roll number ${roll} at index ${index}`
		);
	} catch (e) {
		console.error(e);
		redirect("/");
	}

	const qs = allocate(index);

	const data = {
		name,
		roll,
		qs,
	};

	const encryptedStringBase64 = await encryptCryptoBase64(
		JSON.stringify(data)
	);

	cookies().set("data", encryptedStringBase64);

	return redirect(`/q/${qs[1]}`);
}
