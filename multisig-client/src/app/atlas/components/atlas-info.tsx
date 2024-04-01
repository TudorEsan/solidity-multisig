import { Button } from "@/components/ui/button";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import Image from "next/image";
import React from "react";
import { useWriteContract } from "wagmi";

export const AtlasInfo = ({ address }: { address: string }) => {
  const { address: multisigAddress } = useGetSelectedWallet();
  const { writeContractAsync } = useWriteContract();
  return (
    <div className="flex gap-8 flex-wrap-reverse items-center justify-between">
      <div>
        <h1 className="text-2xl">Atlas is activated</h1>
        <p className="max-w-md">
          Atlas is activated with the address{" "}
          <span className="font-bold">{address}</span>{" "}
        </p>
        <div className="mt-4">
          <Button
            onClick={async () => {
              writeContractAsync({
                abi: MultisigAbi,
                address: multisigAddress,
                functionName: "deactivateAtlas",
              });
            }}
          >
            Deactivate Atlas
          </Button>
        </div>
      </div>
      <Image width={300} height={400} src="/images/atlas.png" alt="atlas" />
    </div>
  );
};
