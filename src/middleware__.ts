import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptCryptoBase64 } from "./lib/encryption";
import { sql } from "@vercel/postgres";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	// get the data cookie
	const dataCookie = request.cookies.get("data");
	if (!dataCookie) {
		return NextResponse.redirect("/");
	}

	const decryptedData = await decryptCryptoBase64(dataCookie.value);
	// if the data is not valid, redirect to the home page
	if (!decryptedData) {
		request.cookies.delete("data");
		return NextResponse.redirect("/");
	}

	const parsedData = JSON.parse(decryptedData);
	// if the roll is not valid, redirect to the home page
	if (!parsedData.roll) {
		request.cookies.delete("data");
		return NextResponse.redirect("/");
	}

	// get players list
	const players = sql`SELECT id FROM s1 WHERE roll = ${parsedData.roll}`;

	return NextResponse.next();
}
