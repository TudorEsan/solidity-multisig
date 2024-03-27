"use client";

import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout";
import { useSearchParams } from "next/navigation";
import { separateChainFromAddress } from "@/helpers/separateChainFromAddress";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { get } = useSearchParams();
  return (
    <html lang="en" className="dark min-h-screen">
      <body className={cn(inter.className, "min-h-screen bg-black pb-2")}>
        <AppProviders>
          <Layout selectedWallet={separateChainFromAddress(get("acc"))}>
            {children}
          </Layout>
        </AppProviders>
      </body>
    </html>
  );
}
