"use client";

import React from "react";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
	const formStatus = useFormStatus();

	return (
		<button
			type="submit"
			disabled={formStatus.pending}
			className="bg-blue-500 text-white p-unit-sm rounded outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
		>
			Join the Rave
		</button>
	);
}
