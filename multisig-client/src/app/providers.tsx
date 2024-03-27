"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
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
import { SendTokensModal } from "./dashboard/components/send-tokens";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export const wagmiConfig = getDefaultConfig({
  appName: "My Multisig App",
  projectId: "6829b9ad661ef487af4d0c1bb5aa4a9e",
  chains: [
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
    // zora,
    sepolia,
    optimismSepolia,
  ],
  transports: {
    [optimismSepolia.id]: http(
      "https://optimism-sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb"
    ),
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb"
    ),
  },
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider theme={darkTheme()}>
              <ProgressBar
                height="4px"
                color="#FFFFFF"
                options={{ showSpinner: false }}
                shallowRouting
              />
              <Toaster />
              <SendTokensModal />
              <NextUIProvider>{children}</NextUIProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
