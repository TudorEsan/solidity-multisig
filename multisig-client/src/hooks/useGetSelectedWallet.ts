import { useSearchParams } from "next/navigation";

export const useGetSelectedWallet = () => {
  const params = useSearchParams();
  const account = params.get("acc") as string | undefined;
  const [chain, address] = account?.split(":") ?? [];
  return { chain, address };
};
