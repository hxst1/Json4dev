import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON4DEV - Format, Validate & Beautify JSON",
  description: "A modern, fast and beautiful JSON formatter, validator and minifier for developers. Format, validate, and beautify your JSON in seconds.",
  keywords: ["json", "formatter", "validator", "minifier", "beautifier", "developer tools"],
  authors: [{ name: "JSON4DEV" }],
  openGraph: {
    title: "JSON4DEV - Format, Validate & Beautify JSON",
    description: "A modern JSON formatter and validator for developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}