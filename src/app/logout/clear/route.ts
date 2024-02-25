import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
	cookies().delete("data");
	cookies().delete("success");
	cookies().delete("success-msg");
	cookies().delete("correct");
	redirect("/logout/clean");
}
