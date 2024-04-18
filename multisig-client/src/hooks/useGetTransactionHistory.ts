import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";
import { getLogs } from "viem/actions";
import { wagmiConfig } from "@/constants/config";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { parseAbiItem } from "viem";

export const useGetTransactionHistory = (id: string) => {
  const { address } = useGetSelectedWallet();
  return useQuery({
    queryKey: QueryKeys.getTranasctionHistory(id),
    queryFn: async () => {
      const confirmLogs = getLogs(wagmiConfig.getClient(), {
        address,
        event: parseAbiItem(
          "event ConfirmTransaction(address indexed owner, uint256 indexed txIndex)"
        ),
        fromBlock: "latest",
        args: {
          txIndex: BigInt(id),
        },
      });

      const revokeLogs = getLogs(wagmiConfig.getClient(), {
        address,
        event: parseAbiItem(
          "event RevokeConfirmation(address indexed owner, uint256 indexed txIndex)"
        ),
        fromBlock: "latest",
        args: {
          txIndex: BigInt(id),
        },
      });

      const log = await Promise.all([confirmLogs, revokeLogs]);
      return [...log[0], ...log[1]].sort((a, b) => {
        // @ts-ignore
        return parseInt(a.blockNumber) - parseInt(b.blockNumber);
      });
    },
  });
};
