import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "JSON4DEV - Format, Validate & Beautify JSON",
    template: "%s | JSON4DEV",
  },
  description:
    "A modern, fast and beautiful JSON formatter, validator and minifier for developers. Format, validate, and beautify your JSON in seconds.",
  keywords: [
    "json",
    "json formatter",
    "json validator",
    "json minifier",
    "json beautifier",
    "json parser",
    "developer tools",
    "web tools",
    "online json",
    "format json online",
    "validate json online",
  ],
  authors: [{ name: "JSON4DEV" }],
  creator: "JSON4DEV",
  publisher: "JSON4DEV",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://json4dev.vercel.app",
    siteName: "JSON4DEV",
    title: "JSON4DEV - Format, Validate & Beautify JSON",
    description:
      "A modern, fast and beautiful JSON formatter, validator and minifier for developers. Format, validate, and beautify your JSON in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON4DEV - JSON Formatter & Validator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON4DEV - Format, Validate & Beautify JSON",
    description:
      "A modern, fast and beautiful JSON formatter, validator and minifier for developers.",
    images: ["/og-image.png"],
    creator: "@json4dev",
  },
  alternates: {
    canonical: "https://json4dev.vercel.app",
  },
  category: "developer tools",
  classification: "Web Application",
  applicationName: "JSON4DEV",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JSON4DEV",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}