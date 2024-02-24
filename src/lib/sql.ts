import combinations from "@/lib/combinations.json" with {type: "json"};
import passcodes from "@/lib/passcodes.json" with {type: "json"};
import { db, sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export async function pushQuestions() {
    const starttime = new Date().toISOString();
    for(let i = 0; i < combinations.length; i++) {
        const q = combinations[i];
        await sql`INSERT INTO s1 (id, clue1, clue2, clue3, passcode, starttime) VALUES (${q[0]}, ${q[1]}, ${q[2]}, ${q[3]}, ${passcodes[i]}, ${starttime})`;
    }
}

export async function deleteQuestions() {
    await sql`DELETE FROM s1`;
}

export async function addNewPlayer(roll:number, name:string) {
    const client = await db.connect();
    await client.sql`BEGIN;`;
    const registered = await client.sql`SELECT roll FROM s1 WHERE roll = ${roll};`;
    if (registered.rowCount > 0) {
        await client.sql`ROLLBACK;`;
        client.release();
        redirect(`/problem?msg=Player with this roll number (${roll}) already exists. We do not permit same person to attempt twice.&sol=Please try again with a different roll number`)
    }
    const curPlayerCount = await client.sql`SELECT COUNT(roll) FROM s1;`;
    const curLen = curPlayerCount.rows[0].count;
    const qRes = await client.sql`SELECT id, clue1, clue2, clue3 FROM s1 WHERE id = ${curLen};`;
    await client.sql`UPDATE s1 SET roll = ${roll}, name = ${name}, status = 'started' WHERE id = ${curLen};`;
    const q = qRes.rows[0];
    await client.sql`COMMIT;`;
    client.release();
    return [parseInt(q.id), q.clue1, q.clue2, q.clue3];
}

export async function validatePasscode(id:number, passcode:string) {
    const client = await db.connect();
    await client.sql`BEGIN;`;
    const res = await client.sql`SELECT passcode FROM s1 WHERE id = ${id};`;
    if (res.rowCount === 0) {
        await client.sql`ROLLBACK;`;
        client.release();
        return "Invalid ID";
    }
    const alreadyEnded = await client.sql`SELECT endtime FROM s1 WHERE id = ${id};`;
    if (alreadyEnded.rows[0].status === "complete") {
        await client.sql`ROLLBACK;`;
        client.release();
        return "Already ended";
    }
    
    if (res.rows[0].passcode === passcode) {
        client.sql`UPDATE s1 SET endtime = ${new Date().toISOString()}, status='complete' WHERE id = ${id};`
        await client.sql`COMMIT;`;
        client.release();
        return "Valid passcode";
    }
    await client.sql`ROLLBACK;`;
    client.release();
    return "Invalid passcode";
}