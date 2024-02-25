import combinations from "@/lib/combinations.json" with {type: "json"};
import passcodes from "@/lib/passcodes.json" with {type: "json"};
import { get } from "@vercel/edge-config";
import { db, sql } from "@vercel/postgres";
import { cookies } from "next/headers";
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
    const registered = await client.sql`SELECT id, roll, name, clue1, clue2, clue3 FROM s1 WHERE roll = ${roll};`;
    if (registered.rowCount > 0) {
        const allowRelogin = await get("allowRelogin");
        if (allowRelogin === "true" && registered.rows[0].name === name) {
            await client.sql`COMMIT;`;
            client.release();
            const {id, clue1, clue2, clue3} = registered.rows[0];
            return [id, clue1, clue2, clue3];
        } else if (allowRelogin === "true" && registered.rows[0].name !== name) {
            await client.sql`ROLLBACK;`;
            client.release();
            redirect(`/problem?msg=Player with this roll number (${roll}) already exists with another name. We do not permit you to login as others.&sol=Please try again with your roll number and name`);
        }
        await client.sql`ROLLBACK;`;
        client.release();
        redirect(`/problem?msg=Player with this roll number (${roll}) already exists. We do not permit same person to attempt twice.&sol=Please try again with a different roll number`)
    }
    const curPlayerCount = await client.sql`SELECT COUNT(roll) FROM s1;`;
    const curLen = curPlayerCount.rows[0].count;
    const qRes = await client.sql`SELECT id, clue1, clue2, clue3 FROM s1 WHERE id = ${curLen};`;
    await client.sql`UPDATE s1 SET roll = ${roll}, name = ${name}, status = 'started', starttime=${new Date().toISOString()} WHERE id = ${curLen};`;
    const q = qRes.rows[0];
    await client.sql`COMMIT;`;
    client.release();
    return [parseInt(q.id), q.clue1, q.clue2, q.clue3];
}

export async function validatePasscode(id:number, passcode:string) {
    const client = await db.connect();
    await client.sql`BEGIN;`;
    const res = await client.sql`SELECT id, passcode FROM s1 WHERE id = ${id};`;
    if (res.rowCount === 0) {
        await client.sql`ROLLBACK;`;
        client.release();
        return "Invalid ID";
    }
    const alreadyEnded = await client.sql`SELECT endtime, status FROM s1 WHERE id = ${id};`;
    if (alreadyEnded.rows[0].status === "complete") {
        await client.sql`ROLLBACK;`;
        if(res.rows[0].passcode.toLowerCase() === passcode) {
            client.release();
            return "Already completed";
        }
    }
    
    if (res.rows[0].passcode.toLowerCase() === passcode) {
        client.sql`UPDATE s1 SET status = 'complete', endtime = ${new Date().toISOString()} WHERE id = ${id};`
        await client.sql`COMMIT;`;
        client.release();
        return "Valid passcode";
    }

    const partsIn = passcode.split("-");
    if (partsIn.length !== 3) {
        await client.sql`ROLLBACK;`;
        client.release();
        return "Invalid passcode";
    }

    const [part1, part2, part3] = partsIn
    const partsDb = res.rows[0].passcode.toLowerCase().split("-");
    const [db1, db2, db3] = partsDb;

    let correct = {
        0: false,
        1: false,
        2: false
    }

    if (part1 === db1) {
        correct[0] = true;
    }

    if (part2 === db2) {
        correct[1] = true;
    }

    if (part3 === db3) {
        correct[2] = true;
    }

    cookies().set("correct", JSON.stringify(correct));

    await client.sql`ROLLBACK;`;
    client.release();
    return "Invalid passcode";
}