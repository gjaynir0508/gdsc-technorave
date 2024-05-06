import { pushQuestions } from "@/lib/manageDB";
import { unstable_noStore } from "next/cache";

export async function GET() {
	unstable_noStore();
	const s = "s12";
	await pushQuestions(s);
	return new Response("Pushed new questions for session " + s);
}
