import { cookies } from "next/headers";

export async function GET() {
	if (cookies().get("data")) {
		console.log("Has some data");
		console.log(cookies().get("data"));
	}
	cookies().delete("data");
	return new Response("Logged out successfully");
}
