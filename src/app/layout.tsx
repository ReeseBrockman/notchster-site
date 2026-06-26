import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://notchster-site.vercel.app"),
  title: "Notchster — live visuals for the stage",
  description:
    "A live-visuals instrument for musicians and DJs. Perform your own reactive visuals straight from your Mac. Coming soon.",
  openGraph: {
    title: "Notchster — live visuals for the stage",
    description:
      "A live-visuals instrument for musicians and DJs. Perform your own reactive visuals straight from your Mac. Coming soon.",
    images: ["/icon.png"],
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
