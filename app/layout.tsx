import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap" });

const title = `${site.name} — ${site.roles[0]}`;

// The link-preview image comes from app/opengraph-image.tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  authors: { name: site.name },
  keywords: [
    "Shopify developer",
    "Shopify theme development",
    "Klaviyo",
    "Meta ads",
    "conversion rate optimisation",
    "CRO",
    "e-commerce",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDE6D6" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1410" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
