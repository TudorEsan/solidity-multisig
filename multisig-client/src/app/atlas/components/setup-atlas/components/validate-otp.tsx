"use client";
import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { validateOTP } from "@/lib/2fa";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";

export const ValidateOTP = ({
  handleNext,
  handleBack,
}: {
  handleNext: () => void;
  handleBack: () => void;
}) => {
  const [value, setValue] = React.useState<string>("");
  const { address } = useGetSelectedWallet();

  const handleOtpValidation = async () => {
    console.log("OTP:", value);
    const valid = await validateOTP(value, address);
    console.log("Valid:", valid);
  };

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
        <Button className="w-[250px] mt-full" onClick={handleOtpValidation}>
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
