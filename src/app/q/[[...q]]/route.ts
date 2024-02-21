import { decryptCryptoBase64 } from "@/lib/encryption";
import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import fs from "node:fs";
import path from "node:path";

export async function GET(request: NextRequest) {
	const reqQues = request.nextUrl.pathname.split("/").pop();
	// read the cookie
	const cookie = request.cookies.get("data");
	if (!cookie) {
		redirect("/");
	}

	const curSession = await get("session");
	if (!curSession) {
		request.cookies.delete("data");
		redirect("/waiting");
	}

	// decrypt the cookie
	let data;
	try {
		const decrypted = await decryptCryptoBase64(cookie.value);
		data = JSON.parse(decrypted);
		if (!data.qs.slice(1).includes(reqQues)) {
			redirect(`/q/${data.qs[1]}`);
		}
	} catch (e) {
		request.cookies.delete("data");
		redirect("/");
	}

	const p = path.resolve(
		"src/questions/",
		curSession.toString(),
		reqQues + ".html"
	);

	// read file contents from the file system
	const file = fs.readFileSync(p);
	const html = file.toString();
	// add extra links to html
	const htmlWithLinks = html.replace(
		"</body>",
		`<style>
		.link {
			background-color: #1f2937;
			color: white;
			padding: 8px 24px;
			border-radius: 4px;
			text-decoration: none;
			text-align: center;
			transition: all 0.2s;
		}
		.link:hover {
			background-color: #374151;
		}

		.answer-form {
			position: absolute;
			bottom: 32px;
			right: 50%;
			transform: translateX(50%);
		}

		.answer-form input {
			padding: 1rem 2rem;
			border-radius: 4px;
			border: 1px solid #ddd;
			outline: none;
			width: 4rem;
			font-family: monospace;
			text-align: center;
			font-size: 1.5rem;
		}

		.answer-form button {
			font-size: 1.5rem;
			padding: 1rem 3rem;
			border-radius: 4px;
			border: none;
			background-color: #1f2937;
			color: white;
			cursor: pointer;
			transition: all 0.2s;
		}
		</style>
		<div style="position: absolute; bottom: 32px; right: 32px; display: flex; flex-direction: column; gap: 32px;">
			<a class="link" href="/q/${data.qs[1]}">Clue 1</a>
		    <a class="link" href="/q/${data.qs[2]}">Clue 2</a>
		    <a class="link" href="/q/${data.qs[3]}">Clue 3</a>
			</div>
		${
			reqQues == data.qs[3]
				? `
			<form class="answer-form" action="/validate" method="post">
				<input type="text" name="part1" placeholder="part1" required>-<input type="text" name="part2" placeholder="part2" required>-<input type="text" name="part3" placeholder="part3" required>
				<button type="submit">Submit</button>
			</form>
			`
				: ""
		}
		</body>`
	);

	return new Response(htmlWithLinks, {
		headers: {
			"content-type": "text/html",
		},
	});
}
