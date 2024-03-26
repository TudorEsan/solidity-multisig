"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { ShareAddress } from "./share-address";
import { useNativeAndERC20Balances } from "@/hooks/useNativeAndERC20Balances";
import { ethers } from "ethers";

export const Header = () => {
  const { tokens } = useNativeAndERC20Balances([]);
  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col">
        <p className="text-muted-foreground text-sm">Total Asset Value</p>
        <p className="text-4xl font-semibold">
          {ethers.utils.formatEther(tokens?.[0]?.balance).toString()} ETH
        </p>
      </div>
      <Button size="icon" className="rounded-full">
      </Button>
      <ShareAddress />
    </div>
  );
};
