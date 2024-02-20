import fs from "node:fs";
import path from "path";

// encrypt and decrypt using a symmetric key algorithm
async function generateKey() {
	const key = await crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256,
		},
		true,
		["encrypt", "decrypt"]
	);

	// save the key by writing to a file
	const exported = await crypto.subtle.exportKey("jwk", key);
	const p = path.resolve("src/lib/key.json");
	fs.writeFileSync(p, JSON.stringify(exported));

	return key;
}

export async function encryptCryptoBase64(data: string) {
	// generate key if not existing
	let key;
	const p = path.resolve("src/lib/key.json");
	if (fs.existsSync(p)) {
		const keyData = fs.readFileSync(p).toString();
		key = await crypto.subtle.importKey(
			"jwk",
			JSON.parse(keyData),
			{ name: "AES-GCM" },
			true,
			["encrypt"]
		);
	} else {
		key = await generateKey();
	}
	const encoded = new TextEncoder().encode(data);
	const iv = crypto.getRandomValues(new Uint8Array(12));
	// add iv to the start of the encrypted data
	const encrypted = await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: iv,
		},
		key,
		encoded
	);

	// convert ArrayBuffer to base64 string
	const encryptedStringBase64 = Buffer.from(encrypted).toString("base64");

	// convert iv to base64 string
	const ivStringBase64 = Buffer.from(iv).toString("base64");

	// return iv + encrypted data
	return ivStringBase64 + encryptedStringBase64;
}

export async function decryptCryptoBase64(encryptedStringBase64: string) {
	//reject if key is not present
	const p = path.resolve("src/lib/key.json");
	if (!fs.existsSync(p)) {
		throw new Error("Key not found");
	}
	const keyData = fs.readFileSync(p).toString();
	const key = await crypto.subtle.importKey(
		"jwk",
		JSON.parse(keyData),
		{ name: "AES-GCM" },
		true,
		["decrypt"]
	);

	// convert base64 string to ArrayBuffer
	const encrypted = Uint8Array.from(
		Buffer.from(encryptedStringBase64, "base64")
	);

	const decrypted = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: encrypted.slice(0, 12),
		},
		key,
		encrypted.slice(12)
	);

	const decryptedString = new TextDecoder().decode(decrypted);

	return decryptedString;
}
