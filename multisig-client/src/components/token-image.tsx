"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

import { cn } from "@/lib/utils";

export interface TokenImageProps
  extends React.HTMLAttributes<HTMLImageElement> {
  placeholder?: PlaceholderValue;
  identifier?: string;
  tokenUrl?: string;
}

export const TokenImage = ({
  identifier,
  className,
  tokenUrl,
  ...rest
}: TokenImageProps) => {
  const [imgSrc, setImgSrc] = useState(tokenUrl);
  // src contains media.elrond.com/nfts

  const handleError = () => {
    setImgSrc("/images/unknown-esdt.png");
  };

  return (
    <Image
      key={imgSrc}
      src={imgSrc ?? ""}
      onError={handleError}
      {...rest}
      height={40}
      width={40}
      quality={100}
      alt={`Token Logo ${identifier}`}
      className={cn("rounded-full bg-black  w-10 h-10", className)}
    />
  );
};
