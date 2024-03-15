"use client";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import type { Metadata } from "next";
import { AppNavbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppProviders>
          <AppNavbar />
          <div className="max-w-3xl flex flex-col mx-auto px-4 py-8 sm:py-12">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
