"use client";
import React from "react";
import { GradientAvatar } from "./gradient-avatar";
import { shortenAddress } from "@/helpers/shortenAddress";
import { Button } from "./ui/button";
import {
  CheckIcon,
  ClipboardCopyIcon,
  SymbolIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

/**
 * Renders a wallet component that displays the wallet address and name (if available).
 *
 * @param {Object} props - The component props.
 * @param {string | null} props.name - The name of the wallet (can be null).
 * @param {string} props.address - The address of the wallet.
 * @returns {JSX.Element} The rendered wallet component.
 */
export const ShowWallet = ({
  address,
  name,
}: {
  name: string | null;
  address: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex items-center gap-3 p-2 border rounded-md">
      <GradientAvatar size={40} text={address} />
      <div className="flex flex-col">
        {name && <p>{name}</p>}
        <p className="text-muted-foreground">{shortenAddress(address)}</p>
        <div className="flex gap-2">
          <button
            className="rounded-full p-1.5 bg-slate-900 border hover:scale-105"
            onClick={() => {
              navigator.clipboard.writeText(address);
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
          >
            {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
          </button>
          <Link
            href={`/accounts`}
            className="rounded-full p-1.5 bg-slate-900 border hover:scale-105"
          >
            <SymbolIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};
