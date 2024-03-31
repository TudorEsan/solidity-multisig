"use client";
import { DisplayAddress } from "@/components/display-address";
import { Card } from "@/components/ui/card";
import { useGetOwners } from "@/hooks/useGetOwners";
import { useGetTransactions } from "@/hooks/useGetTransactions";
import { ScrollShadow } from "@nextui-org/react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRequiredConfirmations } from "@/hooks/useGetRequiredConfirmations";
import { truncateMiddle } from "@/helpers/truncate";
import { TokenImage } from "@/components/token-image";
import { GradientAvatar } from "@/components/gradient-avatar";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import { Routes } from "@/routes";
import React from "react";
import { formatEther } from "viem";

export const TransactionHistory = () => {
  const transactionHistory = useGetTransactions();
  return (
    <Card className="p-4">
      <h1 className="text-xl font-semibold">Transaction History</h1>
      <ScrollShadow className="h-[325px] mt-4 space-y-4" hideScrollBar>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[140px]">From</TableHead>
              <TableHead className="w-[140px]">To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Gas Used</TableHead>
              <TableHead>Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionHistory.data?.reverse().map((transaction, i) => (
              <TableRow key={i + "transaction"}>
                {/* @ts-ignore */}
                <TableCell>
                  {new Date(
                    // @ts-ignore
                    Number(transaction?.timeStamp ?? 0) * 1000
                  ).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    <GradientAvatar size={32} text={transaction.from} />
                    {truncateMiddle(transaction.from, 11)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    <GradientAvatar size={32} text={transaction.to ?? "N/A"} />
                    {truncateMiddle(transaction?.to ?? "N/A", 11)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 items-center">
                    {formatEther(transaction?.value ?? "0")}
                    <TokenImage
                      tokenUrl="/images/ethereum.svg"
                      identifier="ETH"
                      className="w-6 h-6 ml-2"
                    />
                    ETH
                  </div>
                </TableCell>
                <TableCell className="max-w-[100px] truncate">
                  {transaction.input}
                </TableCell>
                {/* @ts-ignore */}
                <TableCell>{parseInt(transaction.gas)}</TableCell>
                <TableCell className="truncate max-w-32">
                  {transaction.hash}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollShadow>
    </Card>
  );
};
