import { clearTableWithBackup, pushQuestions } from "@/lib/manageDB";
import { get } from "@vercel/edge-config";

export async function GET() {
	const curSession = await get("session");
	const nextSession = await get("nextSession");

	if (!curSession) {
		return {
			status: 200,
			body: "Waiting for the next session to start",
		};
	}

	if (!nextSession) {
		return {
			status: 200,
			body: "No more sessions left to start. Please contact the admin to start a new session.",
		};
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

	return {
		status: 200,
		body: "Moved to next session",
	};
}
