"use client";
import { TokenRow } from "@/components/token-row";
import { Card } from "@/components/ui/card";
import { useGetTokenBalance } from "@/hooks/useGetTokenBalance";
import { ScrollShadow } from "@nextui-org/react";
import React from "react";

export const Tokens = () => {
  const { tokens } = useGetTokenBalance([
    "0x4200000000000000000000000000000000000042",
  ]);

  return (
    <Card className="p-4">
      <h1 className="text-xl font-semibold">Your Tokens</h1>
      <ScrollShadow className="h-[325px] mt-4" hideScrollBar>
        {tokens.map((token) => (
          <TokenRow {...token} key={token.identifier} />
        ))}
      </ScrollShadow>
    </Card>
  );
};
