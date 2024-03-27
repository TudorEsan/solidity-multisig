import React, { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";

export const useGetRequiredConfirmations = () => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading, queryKey } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "numConfirmationsRequired",
    args: [],
  });

  const numConfirmationsRequired = useMemo(() => {
    return data?.toString();
  }, [data]);

  return { numConfirmationsRequired, error, isLoading, queryKey };
};
