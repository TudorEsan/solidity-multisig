"use client";
import { Button } from "@/components/ui/button";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { getOrGeneratePrivateKey, generateTOTP } from "@/lib/2fa";
import React from "react";

export const Activate2FaButton = () => {
  const { address } = useGetSelectedWallet();
  const handleClick = async () => {
    const totp = await generateTOTP(address);
    console.log("TOTP:", totp);
  };
  return (
    <div>
      <Button onClick={handleClick}>Activate 2FA</Button>
    </div>
  );
};
