import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "GDSC Digital Odyssey",
	description: "Crack the password to reach the next level!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} w-screen h-screen`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

