import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { SendTokenSchema } from "@/validations/send-token-schema";
import { ReviewSend } from "@/components/review-send";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import Multisig from "@/contracts/Multisig.json";
import { Address, parseEther } from "viem";

export const ReviewTokenSend = ({ close }: { close: () => void }) => {
  const form = useFormContext<SendTokenSchema>();
  const formValues = form.watch();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { address } = useGetSelectedWallet();

  const handleSend = () => {
    writeContract({
      abi: Multisig.abi,
      address: address as Address,
      functionName: "submitTransaction",
      args: [formValues.toAddress, parseEther(formValues.amount), "0x"],
    });
  };

  return (
    <div className="flex flex-col  max-w-xs w-full mx-auto">
      <ReviewSend
        tokenAmount={formValues.amount}
        tokenIdentifier={formValues.token.identifier}
        priceUsd={formValues.priceUsd}
        toAddress={formValues.toAddress}
        url={formValues.token.url}
        fee="0.005"
      />
      <div className="mt-8 flex gap-4">
        <Button variant="secondary" onClick={close} className="flex-grow">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => handleSend()}
          className="flex-grow"
          loading={isPending}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
