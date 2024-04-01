"use client";
import React from "react";
import { SetupAtlas } from "./components/setup-atlas/setup-atlas";
import { useReadContracts } from "wagmi";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";
import { MultisigAbi } from "@/contracts/multisig-abi";
import { LoadingScreen } from "@/components/loading-screen";
import { ActivateAtlas } from "./components/activate-atlas";
import { EMPTY_ADDRESS } from "@/constants/general";
import { AtlasInfo } from "./components/atlas-info";

const Settings = () => {
  const address = useGetSelectedWallet().address;
  const data = useReadContracts({
    contracts: [
      {
        address,
        abi: MultisigAbi,
        functionName: "atlasAddress",
      },
      {
        address,
        abi: MultisigAbi,
        functionName: "atlasProposedActivationAddress",
      },
      {
        address,
        abi: MultisigAbi,
        functionName: "atlasProposedActivationTime",
      },
    ],
  });

  const [
    atlasAddress,
    atlasProposedActivationAddress,
    atlasProposedActivationTime,
  ] = data.data !== undefined ? data.data : [null, null, null];

  if (data.isLoading) {
    return <LoadingScreen />;
  }

  console.log(data);

  if (
    !atlasAddress?.result &&
    atlasProposedActivationAddress?.result !== EMPTY_ADDRESS
  ) {
    return <SetupAtlas />;
  }

  if (
    atlasProposedActivationAddress?.result &&
    atlasProposedActivationAddress?.result !== EMPTY_ADDRESS
  ) {
    return (
      <ActivateAtlas
        address={atlasProposedActivationAddress?.result}
        activationTimestamp={Number(atlasProposedActivationTime?.result)}
      />
    );
  }

  // @ts-ignore
  return <AtlasInfo address={atlasAddress?.result} />;
};

export default Settings;
