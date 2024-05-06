import { createCombinationsForAllSets } from "@/lib/manageQuestions";
import { unstable_noStore } from "next/cache";

export async function GET() {
	unstable_noStore();
	createCombinationsForAllSets();
	return new Response("Created combinations for all sets.");
}
