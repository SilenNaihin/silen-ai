import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalNotebookProvider } from "@/contexts/NotebookContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Silen's Blog",
    template: '%s | Silen',
  },
  description: 'Interactive articles on AI, ML, and software engineering',
  metadataBase: new URL('https://blog.silennai.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: "Silen's Blog",
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@silennai',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalNotebookProvider>
          {children}
        </GlobalNotebookProvider>
      </body>
    </html>
  );
}
