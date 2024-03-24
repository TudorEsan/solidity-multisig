"use client";
import { useNativeAndERC20Balances } from "@/hooks/useGetBalance";
import React from "react";

export const Tokens = () => {
  const tokens = useNativeAndERC20Balances([
    "0x4200000000000000000000000000000000000042",
  ]);

  return <div>Tokens</div>;
};
