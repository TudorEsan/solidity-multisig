import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { formatEther } from "viem";

export const useGetTransactionApprovals = (id: string) => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading, queryKey } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "getApprovedOwners",
    args: [BigInt(id)],
  });

  return { owners, error, isLoading, queryKey };
};
