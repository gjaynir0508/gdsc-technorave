import combinations from "@/lib/combinations.json" with {type: "json"};
import passcodes from "@/lib/passcodes.json" with {type: "json"};
import { sql } from "@vercel/postgres";

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
    await sql`BEGIN`;
    const registered = await sql`SELECT roll FROM s1 WHERE roll = ${roll}`;
    if (registered.rowCount > 0) {
        await sql`ROLLBACK`;
        throw new Error(`Player with roll number ${roll} already exists`);
    }
    const curPlayerCount = await sql`SELECT COUNT(roll) FROM s1`;
    const curLen = curPlayerCount.rows[0].count;
    const qRes = await sql`SELECT id, clue1, clue2, clue3 FROM s1 WHERE id = ${curLen}`;
    await sql`UPDATE s1 SET roll = ${roll}, name = ${name} WHERE id = ${curLen}`;
    const q = qRes.rows[0];
    await sql`COMMIT`;
    return [parseInt(q.id), q.clue1, q.clue2, q.clue3];
}

export async function validatePasscode(id:number, passcode:string) {
    await sql`BEGIN`;
    const res = await sql`SELECT passcode FROM s1 WHERE id = ${id}`;
    if (res.rowCount === 0) {
        await sql`ROLLBACK`;
        return "Invalid ID";
    }
    if (res.rows[0].passcode === passcode) {
        sql`UPDATE s1 SET endtime = ${new Date().toISOString()} WHERE id = ${id}`
        await sql`COMMIT`;
        return "Valid passcode";
    }
    await sql`ROLLBACK`;
    return "Invalid passcode";
}