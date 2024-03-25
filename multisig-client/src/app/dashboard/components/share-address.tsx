"use client";

import { QRCode } from "react-qrcode-logo";
import React from "react";

import { Button } from "@/components/ui/button";
import { GradientAvatar } from "@/components/gradient-avatar";
import { IconCopyButton } from "@/components/icon-copy-button";
import { ArrowDownIcon, Share1Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetSelectedWallet } from "@/hooks/useGetSelectedWallet";

const ShareAddressContent = () => {
  const { address } = useGetSelectedWallet();
  const [copied, setCopied] = React.useState(false);
  const canShare = !!navigator.share;

  const handleCopy = () => {
    navigator.clipboard.writeText(address as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleShare = () => {
    if (canShare) {
      navigator.share({
        title: "My MultiversX Wallet Address",
        text: `Here's my MultiversX wallet address: ${address}`,
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto pb-8">
      <h2 className="text-xl font-bold text-center">Receive</h2>
      <div className="flex items-center gap-2 mt-8">
        <GradientAvatar text={address as string} size={40} />
        <div className="flex flex-col">
          <p className="text-sm font-light text-muted-foreground">
            ETH wallet address{" "}
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-light break-all">{address}</p>
            {canShare && <IconCopyButton text={address as string} />}
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg mx-auto my-8">
        <QRCode
          qrStyle="dots"
          value={address}
          size={150}
          quietZone={5}
          removeQrCodeBehindLogo
          logoPaddingStyle="square"
        />
      </div>
      {!canShare && (
        <Button onClick={handleCopy} className="mx-auto max-w-xs w-full">
          {copied ? "Copied" : "Copy Address"}
        </Button>
      )}
      {canShare && (
        <Button
          onClick={handleShare}
          className="mx-auto max-w-xs w-full mt-4 flex items-center"
        >
          Share
          <Share1Icon className="w-5 h-5 ml-2" />
        </Button>
      )}
    </div>
  );
};

export const ShareAddress = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full">
          <ArrowDownIcon className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ShareAddressContent />
      </DialogContent>
    </Dialog>
  );
};
