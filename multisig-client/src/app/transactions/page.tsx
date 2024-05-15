"use client";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { useGetSubmittedTransactions } from "@/hooks/useGetSubmittedTransactions";
import React, { Suspense } from "react";
import { useReadContract } from "wagmi";

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

export default function Page() {
  const { isLoading, data, error } = useGetSubmittedTransactions();
  const { numConfirmationsRequired, isLoading: isRequiredLoading } =
    useGetRequiredConfirmations();
  const router = useCustomRouter();
  return (
    <Suspense>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Confirmations</TableHead>
            <TableHead>Atlas</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((transaction, i) => (
            <TableRow
              key={i + "transaction"}
              onClick={() => router.push(Routes.transaction(String(i)))}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex gap-1 items-center">
                  <GradientAvatar size={32} text={transaction.to} />
                  {truncateMiddle(transaction.to, 11)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {transaction.amount}
                  <TokenImage
                    tokenUrl="/images/ethereum.svg"
                    identifier="ETH"
                    className="w-6 h-6 ml-2"
                  />
                  ETH
                </div>
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                {transaction.data}
              </TableCell>
              <TableCell>
                {transaction.numConfirmations} / {numConfirmationsRequired}
              </TableCell>
              <TableCell>
                {transaction.atlasConfirmed ? "Confirmed" : "Not Confirmed"}
              </TableCell>
              <TableCell>
                <Badge>
                  {transaction.executed ? "Success" : "Pending Approvals"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {(isLoading || isRequiredLoading) && (
            <TableRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <>
                  <TableCell key={i + "loading"} className="animate-pulse">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell key={i + "loadin1"} className="animate-pulse">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell key={i + "load"} className="animate-pulse">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell key={i + "loading2"} className="animate-pulse">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell key={i + "loadin3"} className="animate-pulse">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                </>
              ))}
            </TableRow>
          )}

          {error && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-red-500">
                    Error loading data. Please try again.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Suspense>
  );
}

function AlertCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
