"use client";
import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { getConfirmAtlasSignature } from "@/lib/atlas";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { useChainId, useWriteContract, useBalance, useBlock } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { parseUnits } from "ethers";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Address } from "viem";
import BigNumber from "bignumber.js";

export const ConfirmAtlas = ({ txIndex }: { txIndex: number }) => {
  const disclosure = useDisclosure();
  const [value, setValue] = React.useState<string>("");
  const { address } = useGetSelectedWallet();
  const { writeContractAsync } = useWriteContract();
  const chain = useChainId();
  const blockBaseFee = useBlock();
  const { data: balanceData } = useBalance({ address: address });

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const signature = await getConfirmAtlasSignature(
          value,
          txIndex,
          address,
          chain
        );
        console.log("Signature:", signature);

        const baseFeePerGas = BigInt(15398100000);
        console.log("Base Fee Per Gas:", baseFeePerGas);
        if (!baseFeePerGas) {
          toast.error("Cannot fetch base fee");
          return;
        }

        const maxPriorityFeePerGas = parseUnits("3.0", "gwei");
        const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;
        const gasLimit = BigInt(200000000);

        const gasCost = maxFeePerGas * gasLimit;
        const balance = balanceData?.value;
        console.log("Balance:", balance, "Gas Cost:", gasCost.toString());
        // if (balance && balance < gasCost) {
        //   toast.error("Insufficient balance");
        //   return;
        // }

        await writeContractAsync({
          abi: MultisigAbi,
          address: address,
          functionName: "confirmAtlas",
          args: [BigInt(txIndex), signature as Address],
          // gas: gasLimit,
          // maxPriorityFeePerGas,
          // maxFeePerGas,
        });

        toast.success("Transaction sent successfully");
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Failed to validate OTP");
      }
    },
  });

  return (
    <>
      <Button onClick={disclosure.onOpen} className="w-full">
        Confirm Atlas
      </Button>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Confirm Atlas</ModalHeader>
          <ModalBody>
            <div className="h-[350px] p-4">
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
                  <Button
                    loading={mutation.isPending}
                    className="w-[250px] mt-full"
                    onClick={() => mutation.mutate()}
                  >
                    Validate
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
        <ModalFooter />
      </Modal>
    </>
  );
};
