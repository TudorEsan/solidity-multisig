import React from "react";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { useReadContract } from "wagmi";
import { MultisigAbi } from "@/contracts/multisig-abi";

export const useGetOwners = () => {
  const { address } = useGetSelectedWallet();

  return useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "getOwners",
  });
};
