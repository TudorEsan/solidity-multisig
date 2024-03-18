import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDeployMultisig } from "@/hooks/useDeployMultisig";
import { useSession } from "next-auth/react";
import { CreateWalletForm } from "@/validations/create-wallet-schema";

export const PreviewCreateWallet = () => {
  const form = useFormContext<CreateWalletForm>();
  const values = form.watch();
  const handleDeploy = useDeployMultisig();

  return (
    <Card className="w-full h-auto flex-grow-0 flex-shrink">
      <CardHeader>
        <CardTitle>Wallet Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Threshold</p>
        <p className="text-sm">
          <span className="font-bold text-base">
            {form.watch("threshold") || 0}
          </span>{" "}
          required signatures
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Owners</p>
        <p className="text-sm">
          The Wallet will have a number of {values.addresses?.length ?? 0} owners
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          onClick={form.handleSubmit((data) => handleDeploy.mutate(data))}
          className="w-full"
          loading={handleDeploy.isPending}
        >
          Create Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};
