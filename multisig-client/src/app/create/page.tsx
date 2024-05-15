"use client";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React, { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CreateWalletForm } from "../../validations/create-wallet-schema";
import { AddressManagement } from "./components/address-management";
import { PreviewCreateWallet } from "./components/preview-wallet";

const CreateWallet = () => {
  const form = useForm<CreateWalletForm>({
    defaultValues: {
      addresses: [
        {
          address: "",
        },
      ],
    },
  });

  return (
    <Suspense>
      <FormProvider {...form}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="w-full col-span-2">
            <CardHeader>
              <CardTitle>Create a new Wallet</CardTitle>
              <CardDescription>
                A multisig wallet is a secure type of cryptocurrency wallet that
                requires multiple approvals for transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ControlledInput
                name="name"
                label="Wallet Name"
                className="mb-4"
                description="This will be used to identify the wallet and not be available on chain."
              />
              <ControlledInput
                name="threshold"
                label="Threshold"
                type="digit"
                className="mb-4"
                description="The number of required signatures to approve a transaction."
              />
              <AddressManagement />
            </CardContent>
          </Card>
          <div>
            <PreviewCreateWallet />
          </div>
        </div>
      </FormProvider>
    </Suspense>
  );
};

export default CreateWallet;
