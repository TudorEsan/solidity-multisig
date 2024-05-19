import { DisplayAddress } from "@/components/display-address";
import { Badge } from "@/components/ui/badge";
import { useGetTransactionHistory } from "@/hooks/useGetTransactionHistory";
import React from "react";

export const History = ({ id }: { id: string }) => {
  const txHistory = useGetTransactionHistory(id);
  console.log(txHistory.error, txHistory.data);
  return (
    <div className="max-w-lg w-full ">
      <p className="text-center font-semibold mb-2">History</p>
      <div className="flex flex-col gap-2">
        {txHistory.data?.map((tx) => (
          <div
            className="flex items-center justify-between"
            key={tx.transactionHash}
          >
            <DisplayAddress address={tx.transactionHash} />
            <div className="flex items-center gap-2">
              <Badge>{tx.eventName}</Badge>
              <p className="max-w-28 truncate">{tx.transactionHash}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
