"use client";
import { TokenRow } from "@/components/token-row";
import { Card } from "@/components/ui/card";
import { useGetTokenBalance } from "@/hooks/useGetTokenBalance";
import { ScrollShadow } from "@nextui-org/react";
import React from "react";

export const Owners = () => {
  return (
    <Card className="mt-8 p-4">
      <h1 className="text-xl">Your Tokens</h1>
      <ScrollShadow className="h-[325px] mt-4" hideScrollBar>
        {/* {tokens.map((token) => (
          <TokenRow {...token} key={token.identifier} />
        ))} */}
      </ScrollShadow>
    </Card>
  );
};
