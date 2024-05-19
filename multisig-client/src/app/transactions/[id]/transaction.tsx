"use client";
import { DisplayAddress } from "@/components/display-address";
import { LoadingScreen } from "@/components/loading-screen";
import { ReviewSend } from "@/components/review-send";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetRequiredConfirmations } from "@/hooks/useGetRequiredConfirmations";
import { useGetTransaction } from "@/hooks/useGetTransaction";
import { useGetTransactionApprovals } from "@/hooks/useGetTransactionApprovals";
import { useGetTransactionHash } from "@/hooks/useGetTransactionHash";
import { useMultisigMutations } from "@/hooks/useMultisigMutations";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { History } from "./components/history";
import { RefreshIcon } from "@heroicons/react/solid";
import { QueryKeys } from "@/hooks/query-keys";
import { ConfirmAtlas } from "./components/confirm-atlas";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
  useBalance,
  useBlock,
} from "wagmi";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { EMPTY_ADDRESS } from "@/constants/general";
import { toast } from "sonner";
import { parseUnits, ethers } from "ethers";
import { Address } from "viem";

export const Transaction = ({ id }: { id: string }) => {
  const { address } = useGetSelectedWallet();
  const { numConfirmationsRequired, error, isLoading, queryKey } =
    useGetRequiredConfirmations();
  const {
    transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
    queryKey: transactionQueryKey,
  } = useGetTransaction(id);
  const {
    acceptTransaction,
    revokeTransaction,
    loading: loadingMutation,
    isPending,
  } = useMultisigMutations();
  const { data: atlasAddress } = useReadContract({
    address: address,
    abi: MultisigAbi,
    functionName: "atlasAddress",
  });
  const atlasEnabled = atlasAddress && atlasAddress !== EMPTY_ADDRESS;
  const { owners, queryKey: ownersQueryKeys } = useGetTransactionApprovals(id);
  const queryClient = useQueryClient();
  const txHash = useGetTransactionHash(id, transaction?.executed ?? false);
  const { writeContractAsync } = useWriteContract();
  const blockBaseFee = useBlock();
  const { data: balanceData } = useBalance({ address: address as Address });

  useWatchContractEvent({
    address: address,
    abi: MultisigAbi,
    eventName: "ConfirmTransaction",
    onLogs: async () => {
      console.log("ConfirmTransaction event detected");
      toast.success("Transaction confirmed");
      await handleRefresh();
    },
  });

  useWatchContractEvent({
    address: address,
    abi: MultisigAbi,
    eventName: "RevokeConfirmation",
    onLogs: async () => {
      console.log("RevokeConfirmation event detected");
      toast.success("Confirmation revoked");
      await handleRefresh();
    },
  });

  useWatchContractEvent({
    address: address,
    abi: MultisigAbi,
    eventName: "ExecuteTransaction",
    onLogs: async () => {
      console.log("ExecuteTransaction event detected");
      toast.success("Transaction executed");
      await handleRefresh();
    },
  });

  const queries = [
    queryKey,
    transactionQueryKey,
    ownersQueryKeys,
    QueryKeys.getTranasctionHistory(id),
    QueryKeys.getTransactionHash(id),
  ];

  const handleRefresh = async () => {
    await Promise.all(
      queries.map((query) =>
        queryClient.invalidateQueries({
          queryKey: query,
        })
      )
    );
  };

  const hasEnoughConfirmations =
    Number(transaction.numConfirmations) >= Number(numConfirmationsRequired);

  const executeTransaction = async () => {
    try {
      const baseFeePerGas = blockBaseFee.data?.baseFeePerGas;
      if (!baseFeePerGas) {
        toast.error("Cannot fetch base fee");
        return;
      }

      const maxPriorityFeePerGas = parseUnits("2.0", "gwei");
      const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
      const gasLimit = BigInt(2000000);

      const gasCost = maxFeePerGas * gasLimit;
      const balance = balanceData?.value;

      if (balance && balance < gasCost) {
        toast.error("Insufficient balance");
        return;
      }

      await writeContractAsync({
        abi: MultisigAbi,
        address,
        functionName: "executeTransaction",
        args: [BigInt(id)],
        gas: gasLimit,
        maxPriorityFeePerGas,
        maxFeePerGas,
      });

      toast.success("Transaction executed successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to execute transaction");
    }
  };

  if (isLoading || isTransactionLoading) {
    return <LoadingScreen />;
  }

  if (error || transactionError) {
    console.error(error, transactionError);
    return <div>{error?.message || transactionError?.message}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <Card className="p-4">
        <div className="mx-auto max-w-sm">
          <ReviewSend
            toAddress={transaction.to as string}
            tokenAmount={transaction.amount}
            priceUsd={"0"}
            url="/images/ethereum.svg"
            tokenIdentifier="ETH"
          />
        </div>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <table>
            <tbody>
              <tr>
                <td className="pr-6 font-bold">Transaction Status</td>
                <td>{transaction.executed ? "Executed" : "Pending"}</td>
              </tr>
              <tr>
                <td className="pr-6 font-bold">Transaction Hash</td>
                <td>
                  <div className="max-w-40 truncate">
                    {txHash.data ? txHash.data[0]?.transactionHash : "N/A"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-6 font-bold">Transaction ID</td> <td>{id}</td>
              </tr>
              <tr>
                <td className="pr-6 font-bold">Confirmations</td>
                <td>
                  <Badge>
                    {transaction.numConfirmations}/{numConfirmationsRequired}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4">Owners who approved</p>
          <div className="flex flex-col gap-2 mt-2">
            {(!owners || owners.length) === 0 && (
              <p className="text-muted-foreground">
                No owners have approved this transaction
              </p>
            )}
            {owners?.map((owner) => (
              <DisplayAddress key={owner} address={owner} />
            ))}
          </div>
          {!transaction?.executed && (
            <div className="mt-8 flex gap-4">
              <Button
                className="w-full"
                variant="destructive"
                onClick={async () => {
                  await revokeTransaction(id, queries);
                }}
              >
                {isPending && loadingMutation === "reject"
                  ? "Revoking..."
                  : "Revoke"}
              </Button>
              {!hasEnoughConfirmations && (
                <Button
                  className="w-full"
                  onClick={async () => {
                    await acceptTransaction(id, queries);
                  }}
                >
                  {isPending && loadingMutation === "accept"
                    ? "Confirming..."
                    : "Confirm"}
                </Button>
              )}
              {hasEnoughConfirmations &&
                atlasEnabled &&
                !transaction.atlasConfirmed && (
                  <ConfirmAtlas txIndex={Number(id)} />
                )}
              {hasEnoughConfirmations &&
                (!atlasEnabled ||
                  (atlasEnabled && transaction.atlasConfirmed)) && (
                  <Button className="w-full" onClick={executeTransaction}>
                    Execute
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="col-span-full flex items-center justify-center flex-col">
        <History id={id} />
        <Button
          className="mt-8 flex gap-2"
          size="sm"
          variant="outline"
          onClick={handleRefresh}
        >
          <RefreshIcon className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
