import React, { useMemo } from "react";

import { cn } from "@/lib/utils";
import { shortNumberFormater } from "@/helpers/numberFormaters";
import { BigNumber, ethers } from "ethers";
import { TokenImage } from "./token-image";
import { StyledNumber } from "./styled-number";

export interface TokenRowProps {
  identifier: string;
  price?: number;
  balance?: string;
  decimals?: number;
  className?: string;
  url?: string;
}

export const TokenRow = ({
  identifier,
  price,
  balance,
  decimals,
  className = "",
  url,
}: TokenRowProps) => {
  const amount = useMemo(() => {
    if (!balance || !decimals) return "0";
    return shortNumberFormater(ethers.utils.formatUnits(balance, decimals));
  }, [balance, decimals]);

  const memoedPriceAmount = useMemo(() => {
    if (!balance || !price || !decimals) return "0";
    const denominated = ethers.utils.formatUnits(balance, decimals);
    const priceAmount = BigNumber.from(denominated).mul(price ?? 0);
    return priceAmount.toString();
  }, [price, amount, decimals]);

  return (
    <div className={cn("flex justify-between w-full", className)}>
      <div className="flex gap-1 items-center">
        <TokenImage
          className="w-9 h-9 mr-2"
          tokenUrl={url}
          identifier={identifier}
        />
        <div className="flex flex-col justify-center">
          <span className="text-base">{identifier}</span>
          {price && (
            <StyledNumber
              symbol="$"
              number={price ?? 0}
              digits={5}
              className="justify-start"
              integerStyles="text-xs text-right leading-4 text-gray-600"
              fractionStyles="text-[0.7rem] text-right leading-4 text-gray-600"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 m-auto mr-2.5">
        <span className="text-base text-right leading-4">{amount}</span>
        <StyledNumber
          symbol="$"
          number={memoedPriceAmount}
          className="justify-end"
          integerStyles="text-xs text-right leading-4 text-gray-600"
          fractionStyles="text-[0.7rem] text-right leading-4 text-gray-600"
        />
      </div>
    </div>
  );
};
