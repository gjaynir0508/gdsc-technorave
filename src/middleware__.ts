import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	console.log("middleware", request.url);
	console.log("middleware", request.nextUrl.pathname);
	// return NextResponse.redirect(new URL("/", request.url));
	return NextResponse.next();
}

export const config = {
	matcher: "/q/:path*",
};
