import React, { useMemo } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMultisigMutations = () => {
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { address } = useGetSelectedWallet();
  const [loading, setLoading] = React.useState<null | "accept" | "reject">(
    null,
  );
  const queryClient = useQueryClient();

  const acceptTransaction = async (id: string, queryKeys: QueryKey[]) => {
    try {
      setLoading("accept");
      await writeContractAsync({
        address,
        abi: MultisigAbi,
        functionName: "confirmTransaction",
        args: [BigInt(id)],
      });
      queryKeys.forEach(async (queryKey) => {
        await queryClient.invalidateQueries({
          queryKey,
        });
      });
    } catch (e: any) {
      toast.error(e?.message ?? "An error occurred");
      console.log(e);
    } finally {
      setLoading(null);
    }
  };

  const revokeTransaction = async (id: string, queryKeys: QueryKey[]) => {
    try {
      setLoading("reject");
      await writeContractAsync({
        address,
        abi: MultisigAbi,
        functionName: "revokeConfirmation",
        args: [BigInt(id)],
      });
      queryKeys.forEach(async (queryKey) => {
        await queryClient.invalidateQueries({
          queryKey,
        });
      });
    } catch (e: any) {
      toast.error(e?.message ?? "An error occurred");
      console.log(e);
    } finally {
      setLoading(null);
    }
  };

  return { acceptTransaction, revokeTransaction, loading, isPending };
};
