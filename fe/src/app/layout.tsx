export const instant = false;

import Providers from "@/components/providers";
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
  title: "Caruhun Rental Armada",
  description: "Sistem Manajemen & Operasional Rental Armada",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" translate="no" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* CSS Material Symbols Outlined untuk Ikon */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      {/* Hilangkan flex & flex-col, tambahkan m-0 p-0 w-full overflow-x-hidden */}
      <body suppressHydrationWarning className="m-0 p-0 min-h-full w-full bg-surface text-on-surface overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
