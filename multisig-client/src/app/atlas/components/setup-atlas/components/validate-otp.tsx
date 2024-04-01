"use client";
import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { validateOTP } from "@/lib/atlas";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { useWriteContract } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { Address } from "viem";
import { toast } from "sonner";

export const ValidateOTP = ({
  handleNext,
  handleBack,
}: {
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const [value, setValue] = React.useState<string>("");
  const { address } = useGetSelectedWallet();
  const { writeContractAsync } = useWriteContract();

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const atlasAddress = await validateOTP(value, address);
        if (!address) {
          throw new Error("Invalid OTP");
        }
        await writeContractAsync({
          address,
          abi: MultisigAbi,
          functionName: "proposeAtlasActivation",
          args: [atlasAddress as Address],
        });
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Failed to validate OTP");
      }
    },
  });

  return (
    <div className="flex flex-col gap-8 items-center justify-between h-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full">
        <p className="text-lg font-bold">Enter the OTP</p>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-col gap-4">
        <Button className="w-[250px] mt-full" onClick={() => mutation.mutate()}>
          Validate
        </Button>
        <Button
          className="w-[250px] mt-full"
          variant="outline"
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
};
