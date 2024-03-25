"use client";
import { useNativeAndERC20Balances } from "@/hooks/useNativeAndERC20Balances";
import React from "react";

export const Tokens = () => {
  const tokens = useNativeAndERC20Balances([
    "0x4200000000000000000000000000000000000042",
  ]);

  return (
    <div className="mt-8">
      <h1 className="text-xl">Your Tokens</h1>
      
    </div>
  );
};
