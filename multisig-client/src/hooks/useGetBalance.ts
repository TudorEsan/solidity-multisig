import { useAccount, useBalance, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { ethers } from "ethers";
import { erc20Abi } from "viem";

/**
 * Custom hook to fetch the native token balance and ERC20 token balances for a given address.
 *
 * @param tokenAddresses - An array of ERC20 token addresses.
 * @returns An object containing the loading state, error state, native balance, and ERC20 balances.
 */
export function useNativeAndERC20Balances(tokenAddresses: string[]) {
  const { address, isConnected } = useAccount();

  // Fetching native token balance
  const {
    data: nativeBalanceData,
    isLoading: isNativeBalanceLoading,
    isError: isNativeBalanceError,
  } = useBalance({
    address: address,
  });

  // Prepare contract reads for ERC20 balances
  const erc20Reads = useMemo(
    () =>
      tokenAddresses.map((tokenAddress) => ({
        addressOrName: tokenAddress,
        contractInterface: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })),
    [tokenAddresses, address]
  );

  const {
    data: erc20BalancesData,
    isLoading: areERC20BalancesLoading,
    isError: areERC20BalancesError,
  } = useReadContracts({
    contracts: erc20Reads,
  });

  // Combine loading states for simplicity
  const isLoading = isNativeBalanceLoading || areERC20BalancesLoading;
  const isError = isNativeBalanceError || areERC20BalancesError;
  console.log(
    erc20BalancesData,
    areERC20BalancesLoading,
    areERC20BalancesError
  );

  // Format ERC20 balances
  const erc20Balances = erc20BalancesData
    ? erc20BalancesData.map((balance, index) => ({
        tokenAddress: tokenAddresses[index],
        balance: balance
          ? ethers.utils.formatUnits((balance.result as number) ?? 0, 18)
          : "0", // Assuming 18 decimals, adjust if needed
      }))
    : [];

  // Format native balance
  const nativeBalance = nativeBalanceData
    ? ethers.utils.formatEther(nativeBalanceData.value)
    : "0";

  return {
    isLoading,
    isError,
    nativeBalance,
    erc20Balances,
  };
}
