"use client";

import React, { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark min-h-screen">
      <body className={cn(inter.className, "min-h-screen bg-black pb-2")}>
        <Suspense>
          <AppProviders>
            <Layout>{children}</Layout>
          </AppProviders>
        </Suspense>
      </body>
    </html>
  );
}
