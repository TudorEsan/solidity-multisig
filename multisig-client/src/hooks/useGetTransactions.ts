import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";
import { useGetSelectedWallet } from "./useGetSelectedWallet";
import { Transaction } from "viem";
import { optimismSepolia } from "viem/chains";
import axios from "axios";
import { useChainId } from "wagmi";

export const useGetTransactions = () => {
  const { address } = useGetSelectedWallet();
  const chainId = useChainId();

  return useQuery({
    queryKey: QueryKeys.getTransactions(address, chainId),
    queryFn: async () => {
      const op_url = `https://api-sepolia-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.OPTIMISTIC_ETHERSCAN_API_KEY}`;
      const eth_url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;
      const url = chainId === optimismSepolia.id ? op_url : eth_url;
      const resp = await axios.get<{
        result?: Transaction[];
      }>(url);
      console.log("resp.data", resp.data);

      return resp.data?.result;
    },
  });
};
