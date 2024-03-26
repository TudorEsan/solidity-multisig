"use client";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { ethers } from "ethers";
import { Address, erc20Abi } from "viem";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { WalletToken } from "@/types/token.type";

/**
 * Custom hook to fetch the native token balance and ERC20 token balances for a given address.
 *
 * @param tokenAddresses - An array of ERC20 token addresses.
 * @returns An object containing the loading state, error state, native balance, and ERC20 balances.
 */
export function useGetTokenBalance(tokenAddresses: string[]) {
  const { address } = useGetSelectedWallet();

  // Fetching native token balance
  const nativeBalance = useBalance({
    address: address as Address,
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
    console.log("heoooo");
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
