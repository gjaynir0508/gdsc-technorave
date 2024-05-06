import { pushQuestions } from "@/lib/manageDB";
import { get } from "@vercel/edge-config";
import { unstable_noStore } from "next/cache";

export async function GET() {
	unstable_noStore();
	const curSession = await get("session");
	console.log("Pushing new questions...");
	await pushQuestions(curSession!.toString());
	console.log("Pushed new questions.");
	return new Response(
		"Pushed new questions for session " + curSession!.toString()
	);
}
