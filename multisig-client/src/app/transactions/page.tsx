"use client";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import React from "react";
import { useReadContract } from "wagmi";

const Page = () => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "transactions",
    args: [BigInt(0)],
  });
  console.log(data, error, isLoading);
  return <div>Page</div>;
};
export default Page;
