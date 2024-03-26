import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./query-keys";

export const useGetTokenPrices = () => {
  return useQuery({
    queryKey: QueryKeys.tokensPrices(),
    queryFn: async () => {
      return { data: [] };
    },
    staleTime: 1000 * 30,
  });
};

export const useGetTokenPrice = (identifier: string) => {
  const tokenPrices = useGetTokenPrices();

  return {
    ...tokenPrices,
    data: 0,
  };
};
