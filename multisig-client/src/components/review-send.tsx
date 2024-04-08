import { ArrowDownIcon } from "@radix-ui/react-icons";

import { DisplayAddress } from "./display-address";
import { TokenImage } from "./token-image";
import { StyledNumber } from "./styled-number";

interface ReviewSendProps {
  tokenIdentifier: string;
  tokenAmount: string;
  priceUsd?: string;
  herotag?: string;
  toAddress: string;
  url?: string;
  fee?: string;
}

export const ReviewSend = ({
  tokenAmount,
  tokenIdentifier,
  priceUsd,
  herotag,
  toAddress,
  fee,
  url,
}: ReviewSendProps) => {
  const tokenLabel = tokenIdentifier.split("-")[0];
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-1 items-center">
          <TokenImage
            tokenUrl={url}
            identifier={tokenIdentifier}
            className="h-10 w-10"
          />
          <p className="text-lg font-bold">{tokenLabel}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <StyledNumber
              withoutFromating
              withoutShortNumber
              number={tokenAmount}
              fractionStyles="truncate max-w-[100px]"
              integerStyles="text-lg"
            />
            <p className="text-sm"> {tokenLabel}</p>
          </div>
          {priceUsd && (
            <StyledNumber
              className="text-muted-foreground"
              withoutShortNumber
              number={priceUsd}
              symbol="$"
            />
          )}
        </div>
      </div>
      <ArrowDownIcon className="h-6 w-6 mt-2 mb-4 ml-2 text-muted-foreground" />
      <DisplayAddress herotag={herotag} address={toAddress} />
      <div className="my-8 grid grid-cols-2">
        <p>Network</p>
        <p className="text-right text-muted-foreground">Ethereum</p>
        {fee && (
          <>
            <p>Fee</p>
            <p className="text-right text-muted-foreground">{fee} ETH</p>
          </>
        )}
      </div>
    </>
  );
};
