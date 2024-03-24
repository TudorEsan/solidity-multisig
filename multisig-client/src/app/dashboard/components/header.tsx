import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import React from "react";

export const Header = () => {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col">
        <p className="text-muted-foreground text-sm">Total Asset Value</p>
        <p className="text-4xl font-semibold">0.00$</p>
      </div>
      <Button size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button>
      <Button size="icon" className="rounded-full">
        <ArrowDownIcon />
      </Button>
    </div>
  );
};