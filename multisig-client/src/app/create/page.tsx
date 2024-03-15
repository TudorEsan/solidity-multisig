import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import React from "react";

const CreateWallet = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Wallet</CardTitle>
        <CardDescription>
          A multisig wallet is a secure type of cryptocurrency wallet that
          requires multiple approvals for transactions.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CreateWallet;
