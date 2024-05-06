import { pushQuestions } from "@/lib/manageDB";
import { get } from "@vercel/edge-config";

export async function GET() {
	const curSession = await get("session");
	console.log("Pushing new questions...");
	await pushQuestions(curSession!.toString());
	console.log("Pushed new questions.");
	return new Response(
		"Pushed new questions for session " + curSession!.toString()
	);
}
