"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, optimismSepolia, arbitrumSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "My Multisig App",
  projectId: "6829b9ad661ef487af4d0c1bb5aa4a9e",
  chains: [sepolia, optimismSepolia, arbitrumSepolia],
  transports: {
    [optimismSepolia.id]: http(
      "https://optimism-sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb"
    ),
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb"
    ),
    [arbitrumSepolia.id]: http(
      "https://arbitrum-sepolia.infura.io/v3/b3615957c6b0427eb2fac15afb451acb"
    ),
  },
  ssr: true,
});
