import React from "react";
import {
  useChainId,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import Multisig from "@/contracts/Multisig.json";
import { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { MultisigService } from "@/service/multisig.service";
import type { WalletSchema } from "@/validations/wallet.schama";
import { CreateWalletForm } from "@/validations/create-wallet-schema";

/**
 * Custom hook for deploying a multisig contract and adding it to the wallet.
 */
export const useDeployMultisig = () => {
  const { data: walletClient } = useWalletClient();
  const chain = useChainId();

  const deployMutation = useMutation({
    mutationFn: async (formData: CreateWalletForm) => {
      const owners = formData.addresses.map((a) => a.address);

      const txHash = await walletClient?.deployContract({
        abi: Multisig.abi,
        bytecode: Multisig.bytecode,
        args: [owners, formData.threshold],
      });

      if (!txHash) {
        throw new Error("Failed to deploy contract");
      }

      const addedWallet = await MultisigService.addWallet({
        owners,
        threshold: Number(formData.threshold),
        chain,
        name: formData.name,
      });

      return addedWallet;
    },
  });

  return deployMutation;
};
