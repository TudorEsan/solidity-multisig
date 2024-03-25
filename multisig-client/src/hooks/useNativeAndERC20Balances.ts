"use client";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { ethers } from "ethers";
import { Address, erc20Abi } from "viem";
import { useGetSelectedWallet } from "./useGetSelectedWallet";

/**
 * Custom hook to fetch the native token balance and ERC20 token balances for a given address.
 *
 * @param tokenAddresses - An array of ERC20 token addresses.
 * @returns An object containing the loading state, error state, native balance, and ERC20 balances.
 */
export function useNativeAndERC20Balances(tokenAddresses: string[]) {
  const { address } = useGetSelectedWallet();

  // Fetching native token balance
  const nativeBalance = useBalance({
    address: address as Address,
  });

  const ethereum = {
    identifier: "ETH",
    price: 0,
    decimals: 18,
    balance: nativeBalance.data?.value?.toString() ?? "0",
    isLoading: nativeBalance.isLoading,
    error: nativeBalance.error,
    url: "/images/ethereum.svg",
  };

  // Prepare contract reads for ERC20 balances
  // const erc20Reads = useMemo(
  //   () =>
  //     tokenAddresses.map((tokenAddress) => ({
  //       addressOrName: tokenAddress,
  //       contractInterface: erc20Abi,
  //       functionName: "balanceOf",
  //       args: [address],
  //     })),
  //   [tokenAddresses, address]
  // );

  // const {
  //   data: erc20BalancesData,
  //   isLoading: areERC20BalancesLoading,
  //   isError: areERC20BalancesError,
  // } = useReadContracts({
  //   contracts: erc20Reads,
  // });

  // // Combine loading states for simplicity
  // const isLoading = isNativeBalanceLoading || areERC20BalancesLoading;
  // const isError = isNativeBalanceError || areERC20BalancesError;
  // // console.log(
  // //   erc20BalancesData,
  // //   areERC20BalancesLoading,
  // //   areERC20BalancesError
  // // );

  // // Format ERC20 balances
  // const erc20Balances = erc20BalancesData
  //   ? erc20BalancesData.map((balance, index) => ({
  //       tokenAddress: tokenAddresses[index],
  //       balance: balance
  //         ? ethers.utils.formatUnits((balance.result as number) ?? 0, 18)
  //         : "0", // Assuming 18 decimals, adjust if needed
  //     }))
  //   : [];

  // Format native balance

  return {
    nativeBalance,
    tokens: [ethereum],
  };
}
