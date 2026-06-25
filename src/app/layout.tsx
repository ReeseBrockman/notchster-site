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
  metadataBase: new URL("https://notchster.vercel.app"),
  title: "Notchster — your notch, but cuter",
  description:
    "A playful macOS menu-bar companion. A little ASCII bunny drops from your notch with weather, music, system stats, and on-device AI.",
  openGraph: {
    title: "Notchster — your notch, but cuter",
    description:
      "A playful macOS menu-bar companion. Weather, music, system stats, and on-device AI, wrapped around a charming ASCII bunny that drops from your notch.",
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
