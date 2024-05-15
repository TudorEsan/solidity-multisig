"use client";
import { NextUIProvider } from "@nextui-org/react";
import React, { Suspense } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SendTokensModal } from "./dashboard/components/send-tokens";
import { wagmiConfig } from "../constants/config";

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
    <Suspense>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider theme={darkTheme()}>
                {/* <ProgressBar
                height="4px"
                color="#FFFFFF"
                options={{ showSpinner: false }}
                shallowRouting
              /> */}
                <Toaster />
                <SendTokensModal />
                <NextUIProvider>{children}</NextUIProvider>
                <ReactQueryDevtools initialIsOpen={false} />
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Suspense>
  );
};
