"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { ShareAddress } from "./share-address";
import { useNativeAndERC20Balances } from "@/hooks/useNativeAndERC20Balances";

export const Header = () => {
  const { nativeBalance } = useNativeAndERC20Balances([]);
  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col">
        <p className="text-muted-foreground text-sm">Total Asset Value</p>
        <p className="text-4xl font-semibold">{nativeBalance} ETH</p>
      </div>
      {/* <Button size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button> */}
      <ShareAddress />
    </div>
  );
};
