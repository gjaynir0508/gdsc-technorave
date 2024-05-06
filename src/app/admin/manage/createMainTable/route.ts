import { sql } from "@vercel/postgres";

export async function GET() {
	await sql`CREATE TABLE s1 (
        id NUMERIC(12) PRIMARY KEY, 
        clue1 VARCHAR(10), 
        clue2 VARCHAR(10),
        clue3 VARCHAR(10),
        passcode VARCHAR(30),
        status VARCHAR(10),
        starttime VARCHAR(30),
        endtime VARCHAR(30),
        roll INT UNIQUE,
        name VARCHAR(30),
        progress INT DEFAULT 0,
        time INT DEFAULT 0)`;

	return new Response("Table created", { status: 200 });
}
