import { useSearchParams } from "next/navigation";
import { Address } from "viem";

export const useGetSelectedWallet = () => {
  const params = useSearchParams();
  const account = params.get("acc") as string;
  const [chain, address] = account?.split(":") ?? [];
  return { chain, address: address as Address };
};
