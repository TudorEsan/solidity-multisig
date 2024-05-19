"use client";
import { useBalance, useWatchContractEvent } from "wagmi";
import { useMemo } from "react";
import { Address } from "viem";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { WalletToken } from "@/types/token.type";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { toast } from "sonner";

/**
 * Custom hook to fetch the native token balance and ERC20 token balances for a given address.
 *
 * @param tokenAddresses - An array of ERC20 token addresses.
 * @returns An object containing the loading state, error state, native balance, and ERC20 balances.
 */
export function useGetTokenBalance(tokenAddresses: string[]) {
  const { address } = useGetSelectedWallet();

  const nativeBalance = useBalance({
    address: address as Address,
  });

  useWatchContractEvent({
    address: address as Address,
    abi: MultisigAbi,
    eventName: "Deposit",
    onLogs: () => {
      console.log("Deposit event detected");
      toast.success("Deposit event detected");
      nativeBalance.refetch();
    },
  });

  const tokens = useMemo(() => {
    const ethereum: WalletToken = {
      identifier: "ETH",
      price: 0,
      decimals: 18,
      balance: nativeBalance.data?.value?.toString() ?? "0",
      url: "/images/ethereum.svg",
      type: "ETH",
    };
    return [ethereum];
  }, [nativeBalance.data?.value]);

  const isLoading = useMemo(
    () => nativeBalance.isLoading,
    [nativeBalance.data?.value]
  );

  return {
    isLoading,
    tokens,
  };
}
