import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ostrelio — Runtime authorization for AI agents",
  description: "The authorization layer for autonomous software. Control every agent action at runtime.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://boundary.dev"),
  openGraph: {
    title: "Ostrelio — Runtime authorization for AI agents",
    description: "Check consequential AI-agent actions before they execute.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
