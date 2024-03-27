import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";

export const useCustomRouter = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const push = (path: string) => {
    const acc = queryParams.get("acc");
    router.push(`${path}?acc=${acc}`);
  };

  return {
    push,
  };
};
