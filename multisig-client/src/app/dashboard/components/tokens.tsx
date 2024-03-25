"use client";
import { TokenRow } from "@/components/token-row";
import { useNativeAndERC20Balances } from "@/hooks/useNativeAndERC20Balances";
import { ScrollShadow } from "@nextui-org/react";
import React from "react";

export const Tokens = () => {
  const { tokens } = useNativeAndERC20Balances([
    "0x4200000000000000000000000000000000000042",
  ]);

  return (
    <div className="mt-8 max-w-md">
      <h1 className="text-xl">Your Tokens</h1>
      <ScrollShadow className="h-[325px] mt-4" hideScrollBar>
        {tokens.map((token) => (
          <TokenRow {...token}  key={token.identifier} />
        ))}
      </ScrollShadow>
    </div>
  );
};
