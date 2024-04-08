import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { formatEther } from "viem";

export const useGetTransaction = (id: string) => {
  const { address } = useGetSelectedWallet();
  const { data, error, isLoading, queryKey } = useReadContract({
    address,
    abi: MultisigAbi,
    functionName: "transactions",
    args: [BigInt(id)],
  });

  const transaction = useMemo(() => {
    return {
      to: data?.[0],
      amount: formatEther(data?.[1] ?? BigInt("0")),
      data: data?.[2],
      executed: data?.[3],
      numConfirmations: data?.[4].toString(),
      atlasConfirmed: data?.[5],
    };
  }, [data]);

  return { transaction, error, isLoading, queryKey };
};
