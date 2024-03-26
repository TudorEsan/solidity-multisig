"use client";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { useGetSubmittedTransactions } from "@/hooks/useGetSubmittedTransactions";
import React from "react";
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

export default function Page() {
  const { isLoading, data, error } = useGetSubmittedTransactions();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Date</TableHead>
          <TableHead>Hash</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Approvals</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((transaction, i) => (
          <TableRow key={i + "transaction"}>
            <TableCell className="font-medium">
              {new Date().toLocaleString()}
            </TableCell>
            <TableCell>1</TableCell>
            <TableCell>me</TableCell>
            <TableCell>{transaction.numConfirmations}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>
              <Badge>{transaction.executed}</Badge>
            </TableCell>
          </TableRow>
        ))}
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6}>
              <div className="animate-pulse flex space-x-4">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
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
