import React from "react";

import { cn } from "@/lib/utils";
import { shortNumberFormater } from "@/helpers/numberFormaters";
import { TokenImage } from "./token-image";

interface Props {
  number: number | string;
  integerStyles?: string;
  fractionStyles?: string;
  numberStyles?: string;
  className?: string;
  digits?: number;
  token?: string;
  symbol?: string;
  withoutShortNumber?: boolean;
  withoutFromating?: boolean;
  suffix?: string;
  url?: string;
}

const formatNumber = (
  number: string,
  digits: number,
  withoutShortNumber = false,
  withoutFromating = false
): [string, string | undefined] => {
  let [integerPart, fractionalPart] = String(number).split(".");
  if (!fractionalPart) {
    fractionalPart = "00";
  }
  if (!integerPart) {
    integerPart = "0";
  }
  if (withoutFromating) {
    return [integerPart, `.${fractionalPart}`];
  }
  if (Number(number) < 1000 || withoutShortNumber) {
    const fractionalPartStyled = fractionalPart
      ? `.${fractionalPart}`.substring(0, digits + 1).padEnd(2, "0")
      : ".00";
    return [integerPart, fractionalPartStyled];
  }
  return [shortNumberFormater(number), undefined];
};

export const StyledNumber = ({
  number,
  token,
  symbol,
  integerStyles = "",
  fractionStyles = "",
  numberStyles = "",
  className = "",
  digits = 3,
  withoutShortNumber = false,
  withoutFromating = false,
  suffix,
  url,
}: Props) => {
  const [integerPart, fractionalPart] = formatNumber(
    String(number),
    digits,
    withoutShortNumber,
    withoutFromating
  );

  return (
    <div
      className={cn("flex items-center", className)}
      aria-label={number.toString()}
    >
      <div className={cn("flex items-baseline", numberStyles)}>
        <span className={cn(`text-base`, integerStyles)}>
          {symbol}
          {integerPart}
        </span>
        <span className={cn(`text-sm`, fractionStyles)}>
          {fractionalPart}
          {suffix}
        </span>
      </div>
      {token && (
        <TokenImage
          tokenUrl={url}
          identifier={token}
          className="w-5 h-5 ml-1"
        />
      )}
    </div>
  );
};
