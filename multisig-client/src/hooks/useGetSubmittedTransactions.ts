import React, { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { BigNumber } from "ethers";

export const useGetSubmittedTransactions = () => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "getTransactions",
    args: [],
  });
  console.log(data);

  const formatedTransactions = useMemo(() => {
    return data?.map((transaction) => {
      return {
        to: transaction[0],
        amount: transaction[1],
        data: transaction[2],
        executed: transaction[3],
        numConfirmations: transaction[4],
      };
    });
  }, [data]);

  return { data: formatedTransactions, error, isLoading };
};
