"use client";
import React from "react";
import { ShareAddress } from "./share-address";
import { useGetTokenBalance } from "@/hooks/useGetTokenBalance";
import { ethers } from "ethers";
import { SendTokensButton } from "./send-tokens";

export const Header = () => {
  const { tokens } = useGetTokenBalance([]);
  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col">
        <p className="text-muted-foreground text-sm">Total Asset Value</p>
        <p className="text-4xl font-semibold">
          {ethers.formatEther(tokens?.[0]?.balance).toString()} ETH
        </p>
      </div>
      <SendTokensButton />
      <ShareAddress />
    </div>
  );
};
