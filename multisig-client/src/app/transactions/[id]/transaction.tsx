"use client";
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
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { useGetTransaction } from "@/hooks/useGetTransaction";
import { useMultisigMutations } from "@/hooks/useMultisigMutations";
import React from "react";

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

  if (isLoading || isTransactionLoading) {
    return <LoadingScreen />;
  }

  if (error || transactionError) {
    return <div>Error</div>;
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
                <td className="pr-6 font-bold">Transaction Status</td>{" "}
                <td>{transaction.executed ? "Executed" : "Pending"}</td>
              </tr>
              <tr>
                <td className="pr-6 font-bold">Transaction ID</td> <td>{id}</td>
              </tr>
              <tr>
                <td className="pr-6 font-bold">Confirmations</td>{" "}
                <td>
                  <Badge>
                    {transaction.numConfirmations}/{numConfirmationsRequired}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 flex gap-4">
            <Button
              className="w-full"
              variant="destructive"
              onClick={async () => {
                await revokeTransaction(id, [queryKey, transactionQueryKey]);
              }}
            >
              {isPending && loadingMutation === "reject"
                ? "Revoking..."
                : "Revoke"}
            </Button>
            <Button
              className="w-full"
              onClick={async () => {
                await acceptTransaction(id, [queryKey, transactionQueryKey]);
              }}
            >
              {isPending && loadingMutation === "accept"
                ? "Confirming..."
                : "Confirm"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
