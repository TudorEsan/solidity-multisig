import { Contacts } from "@/types/transactions.types";
import { useQuery } from "@tanstack/react-query";

export const useGetContacts = () => {
  return useQuery({
    queryFn: async () => {
      return [] as Contacts[];
    },
    staleTime: 1000 * 60,
    queryKey: ["recentTransfers"],
  });
};
