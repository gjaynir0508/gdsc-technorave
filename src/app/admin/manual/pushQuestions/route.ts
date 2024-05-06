import { pushQuestions } from "@/lib/manageDB";

export async function GET() {
	const s = "s12";
	await pushQuestions(s);
	return new Response("Pushed new questions for session " + s);
}
