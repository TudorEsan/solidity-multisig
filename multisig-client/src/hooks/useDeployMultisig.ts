import { useChainId, useWalletClient } from "wagmi";
import Multisig from "@/contracts/Multisig.json";
import { useMutation } from "@tanstack/react-query";
import { MultisigService } from "@/service/multisig.service";
import { CreateWalletForm } from "@/validations/create-wallet-schema";
import { useRouter } from "next/navigation";
import { Routes } from "@/routes";
import { getTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "@/app/providers";

import { toast } from "sonner";

/**
 * Custom hook for deploying a multisig contract and adding it to the wallet.
 */
export const useDeployMultisig = () => {
  const { data: walletClient } = useWalletClient();
  const chain = useChainId();
  const router = useRouter();

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
      console.log({
        txHash,
      });
      let txReceipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      const addedWallet = await MultisigService.addWallet({
        owners,
        threshold: Number(formData.threshold),
        chain,
        name: formData.name,
        address: txReceipt.contractAddress as string,
      });

      router.push(Routes.wallets());
      return addedWallet;
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  return deployMutation;
};
