import { Button } from "@/components/ui/button";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export const ActivateAtlas = ({
  address,
  activationTimestamp,
}: {
  address: string;
  activationTimestamp: number;
}) => {
  const { address: multisigAddress } = useGetSelectedWallet();
  const { writeContractAsync } = useWriteContract();

  return (
    <div className="flex gap-8 flex-wrap-reverse items-center justify-between">
      <div>
        <h1 className="text-2xl">Activate Atlas</h1>
        <p className="text-sm text-gray-500 mt-8 mb-2">Pending Activation</p>
        <p className="max-w-md">
          To activate Atlas for the address{" "}
          <span className="font-bold">{address}</span> that was proposed to be
          activated at{" "}
          <span className="font-bold">
            {new Date(activationTimestamp).toLocaleString()}
          </span>
          , you will need to sign this transaction.
        </p>
        <div className="mt-4">
          <Button
            onClick={async () => {
              try {
                writeContractAsync({
                  abi: MultisigAbi,
                  address: multisigAddress,
                  functionName: "activateAtlas",
                });
              } catch (error: any) {
                toast.error(error?.message || "Failed to activate Atlas");
              }
            }}
          >
            Activate Atlas
          </Button>
        </div>
      </div>
      <Image width={300} height={400} src="/images/atlas.png" alt="atlas" />
    </div>
  );
};
