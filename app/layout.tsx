import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://aayyus-portfolio-nxt.vercel.app/"),

	title: 'Aayush Sharma',
	authors: {   
		name: "Aayush Sharma",
	},

	description:
		"A web developer with a passion for learning and creating.",
	openGraph: {
		title: "Aayush Sharma",
		description:
			"",
		url: "https://next-supabase-vote.vercel.app/",
		siteName: "Aayush Sharma",
		images: "/og.png",
		type: "website",
	},
	keywords: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}> <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider></body>
    </html>
  );
}
