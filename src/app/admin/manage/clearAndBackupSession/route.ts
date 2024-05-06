import { clearTableWithBackup } from "@/lib/manageDB";
import { get } from "@vercel/edge-config";
import { unstable_noStore } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	unstable_noStore();
	const curSession = request.nextUrl.searchParams.get("s");
	console.log("Backing up current session table...");
	await clearTableWithBackup("s1");
	console.log("Backed up current session table");
	return new Response("Backed up current session table.");
}
