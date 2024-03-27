"use client";
import { DisplayAddress } from "@/components/display-address";
import { Card } from "@/components/ui/card";
import { useGetOwners } from "@/hooks/useGetOwners";
import { ScrollShadow } from "@nextui-org/react";
import React from "react";

export const Owners = () => {
  const owners = useGetOwners();
  return (
    <Card className=" p-4">
      <h1 className="text-xl font-semibold">Wallet Owners</h1>
      <ScrollShadow className="h-[325px] mt-4 space-y-4" hideScrollBar>
        {owners.data?.map((address) => (
          <DisplayAddress address={address} key={address} />
        ))}
      </ScrollShadow>
    </Card>
  );
};
