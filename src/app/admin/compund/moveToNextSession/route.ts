import { clearTableWithBackup, pushQuestions } from "@/lib/manageDB";
import { get } from "@vercel/edge-config";

export async function GET() {
	const curSession = await get("session");
	const nextSession = await get("nextSession");

	if (!curSession) {
		return new Response("Waiting for the first session to start", {
			status: 200,
		});
	}

	if (!nextSession) {
		return new Response("No next session to move to", {
			status: 200,
		});
	}

	console.log(
		"Backing up and clearing current session table, session:",
		curSession
	);
	let tableToBackup = new String(curSession).toString();
	await clearTableWithBackup(tableToBackup);
	console.log("Cleared and backed up current session table");
	console.log(
		"Adding new questions to the session table for next session:",
		nextSession
	);
	await pushQuestions(nextSession.toString());
	console.log("Added new questions to the session table");

	return new Response("Moved to next session", {
		status: 200,
	});
}
