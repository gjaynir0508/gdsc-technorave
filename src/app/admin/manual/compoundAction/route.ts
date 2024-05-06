import { pushQuestions } from "@/lib/manageDB";
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";

export async function GET() {
	unstable_noStore();
	// const cur = 1;
	// const curSession = "s" + cur;
	// const nextSession = "s" + (cur + 1);
	const curSession = "s1";
	const nextSession = "s2";
	console.log("curSession: ", curSession);
	console.log("nextSession: ", nextSession);

	console.log("Dropping table if exists");
	await sql`DROP TABLE IF EXISTS ${curSession}_copy`;

	console.log("Creating table copy");
	await sql`CREATE TABLE ${curSession}_copy AS TABLE s1`;

	console.log("Clearing s1 table");
	await sql`DELETE FROM s1`;
	await pushQuestions(nextSession);

	return new Response(
		`Backed up ${curSession} and pushed new questions for ${nextSession}`
	);
}
