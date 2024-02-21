import { db } from "@vercel/postgres";

export async function GET() {
	const client = await db.connect();
	const res = await client.sql`SELECT * FROM s1`;
	client.release();
	console.log(res);
	return new Response("Good");
}
