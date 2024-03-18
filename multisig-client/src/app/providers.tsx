"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  sepolia,
  optimismSepolia,
} from "wagmi/chains";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My Multisig App",
  projectId: "6829b9ad661ef487af4d0c1bb5aa4a9e",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [sepolia, optimismSepolia]
      : []),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export const AppProviders = ({
  children,
}: // session,
{
  children: React.ReactNode;
  // session: Session | null;
}) => {
  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider theme={darkTheme()}>
              <NextUIProvider>{children}</NextUIProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
