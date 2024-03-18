import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import type { Metadata } from "next";
import { AppNavbar } from "@/components/navbar";
import { getSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark min-h-screen">
      <body className={cn(inter.className, "min-h-screen")}>
        <AppProviders>
          <AppNavbar />
          <div className="max-w-5xl flex flex-col mx-auto px-4 py-8 sm:py-12">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
