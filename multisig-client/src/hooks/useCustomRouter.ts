"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export const useCustomRouter = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const push = (path: string) => {
    const acc = queryParams.get("acc");
    router.push(`${path}?acc=${acc}`);
  };

  return {
    ...router,
    push,
  };
};
