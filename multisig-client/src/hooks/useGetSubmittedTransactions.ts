import React, { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { BigNumber } from "ethers";
import { formatEther } from "viem";

export const useGetSubmittedTransactions = () => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "getTransactions",
    args: [],
  });

  const formatedTransactions = useMemo(() => {
    return data?.map((transaction) => {
      return {
        to: transaction.to,
        amount: formatEther(transaction.value),
        data: transaction.data,
        executed: transaction.executed,
        numConfirmations: transaction.numConfirmations.toString(),
        atlasConfirmed: transaction.atlasConfirmed,
      };
    });
  }, [data]);

  return { data: formatedTransactions, error, isLoading };
};
