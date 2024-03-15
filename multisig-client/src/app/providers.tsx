import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My Multisig App",
  projectId: "6829b9ad661ef487af4d0c1bb5aa4a9e",
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: true,
});

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <NextUIProvider>{children}</NextUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
