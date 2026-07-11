import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://aayyus-portfolio-nxt.vercel.app/"),

	title: "Aayush Sharma — Shopify Developer",
	authors: {
		name: "Aayush Sharma",
	},

	description:
		"Shopify 360 developer crafting high-converting storefronts with custom theme development, Klaviyo automation, and Meta advertising integrations.",
	openGraph: {
		title: "Aayush Sharma — Shopify Developer",
		description:
			"Shopify 360 developer crafting high-converting storefronts with custom theme development, Klaviyo automation, and Meta advertising integrations.",
		url: "https://aayyus-portfolio-nxt.vercel.app/",
		siteName: "Aayush Sharma",
		images: "/og.png",
		type: "website",
	},
	keywords: ["Shopify developer", "Klaviyo", "Meta ads", "web developer", "portfolio"],
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
