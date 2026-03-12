import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configure Geist Sans font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update Metadata for ByteBird
export const metadata: Metadata = {
  title: "ByteBird | Share ideas in Bytes or Blogs",
  description: "The micro-blogging platform built specifically for developers and creators. Post quick updates or long-form insights.",
  keywords: ["blogging", "micro-blogging", "developers", "coding", "tech community"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'scroll-smooth' makes the page slide nicely when clicking "Features"
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {/* The children will be your page content (Landing Page, Login, Feed, etc.) */}
        {children}
      </body>
    </html>
  );
}