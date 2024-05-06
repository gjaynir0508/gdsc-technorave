import { createCombinationsForAllSets } from "@/lib/manageQuestions";

export async function GET() {
	createCombinationsForAllSets();
	return new Response("Created combinations for all sets.");
}
