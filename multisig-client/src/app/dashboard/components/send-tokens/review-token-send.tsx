import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { SendTokenSchema } from "@/validations/send-token-schema";
import { ReviewSend } from "@/components/review-send";
import { Button } from "@/components/ui/button";
import {
  useBalance,
  useBlock,
  useGasPrice,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import Multisig from "@/contracts/Multisig.json";
import { Address, parseEther } from "viem";
import { useEffect } from "react";
import { toast } from "sonner";
import { parseUnits } from "ethers";

export const ReviewTokenSend = ({ close }: { close: () => void }) => {
  const form = useFormContext<SendTokenSchema>();
  const gasPrice = useGasPrice();
  const blockBaseFee = useBlock();
  console.log(gasPrice);
  const formValues = form.watch();
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { address } = useGetSelectedWallet();
  const { status } = useWaitForTransactionReceipt({
    hash,
  });
  const { data } = useBalance({
    address: address as Address,
  });

  useEffect(() => {
    if (status === "success") {
      toast.success("Transaction sent successfully");
      close();
    }
  });

  const handleSend = async () => {
    const baseFeePerGas = blockBaseFee.data?.baseFeePerGas;
    if (!baseFeePerGas) {
      toast.error("Cannot fetch base fee");
      return;
    }

    const maxPriorityFeePerGas = parseUnits("2.0", "gwei");
    const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
    const gasLimit = BigInt(210000);

    const value = parseEther(formValues.amount);

    // Calculate the total cost
    const gasCost = maxFeePerGas * gasLimit;
    const totalCost = gasCost + value;

    const balance = data?.value;
    console.log(
      "Balance",
      balance?.toString(),
      "Total cost",
      totalCost.toString()
    );

    if (balance && balance < totalCost) {
      toast.error("Insufficient balance");
      return;
    }

    console.log("Total cost", totalCost.toString());

    const resp = await writeContractAsync({
      abi: Multisig.abi,
      address: address as Address,
      functionName: "submitTransaction",
      args: [formValues.toAddress, parseEther(formValues.amount), "0x"],
    });
    console.log(resp);
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
          loading={isPending || gasPrice.isLoading}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
