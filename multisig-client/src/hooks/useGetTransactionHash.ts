import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";
import { getLogs } from "viem/actions";
import { wagmiConfig } from "@/constants/config";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { parseAbiItem } from "viem";

export const useGetTransactionHash = (id: string, enabled: boolean) => {
  const { address } = useGetSelectedWallet();
  return useQuery({
    queryKey: QueryKeys.getTransactionHash(id),
    queryFn: async () => {
      const log = await getLogs(wagmiConfig.getClient(), {
        address,
        event: parseAbiItem(
          "event ExecuteTransaction(address indexed owner, uint256 indexed txIndex)"
        ),
        fromBlock: BigInt(9861580),
        args: {
          txIndex: BigInt(id),
        },
      });
      return log;
    },
    enabled,
  });
};
