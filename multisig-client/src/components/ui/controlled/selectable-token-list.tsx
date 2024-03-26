import { StyledNumber } from "@/components/styled-number";
import { TokenImage } from "@/components/token-image";
import { useGetTokenPrice } from "@/hooks/useGetTokenPrice";
import { Token } from "@/types/token.type";
import { ScrollShadow, Skeleton } from "@nextui-org/react";
import { Utils } from "@pulsar.money/core";
import { useFormContext } from "react-hook-form";

const SelectTokenItem = ({
  identifier,
  url,
  onClick,
}: {
  identifier: string;
  url: string;
  onClick: () => void;
}) => {
  const tokenPrice = useGetTokenPrice(identifier);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex space-x-3 items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md w-full px-4 py-2"
    >
      <TokenImage
        tokenUrl={url}
        className="w-10 h-10"
        identifier={identifier}
      />
      <div className="flex flex-col items-start">
        <p className="text-lg">
          {Utils.Token.getTokenWithoutIdentifierMx(identifier)}
        </p>
        {tokenPrice.isLoading ? (
          <Skeleton className="w-16 h-5 rounded-full" />
        ) : (
          <StyledNumber
            className="text-muted-foreground"
            integerStyles="text-sm "
            fractionStyles="text-xs"
            symbol="$"
            number={tokenPrice.data ?? 0}
          />
        )}
      </div>
    </button>
  );
};

interface Props {
  tokens: Token[];
  name: string;
  onClick: () => void;
}
export const SelectableTokenList = ({ tokens, name, onClick }: Props) => {
  const form = useFormContext();

  const onSelect = (token: Token) => {
    form.setValue(name, token);
    onClick();
  };

  return (
    <ScrollShadow hideScrollBar className="h-[400px] space-y-1">
      {tokens.length !== 0 ? (
        tokens.map((token) => (
          <SelectTokenItem
            url={token.url}
            onClick={() => onSelect(token)}
            key={token.identifier}
            identifier={token.identifier}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          No tokens found.
        </div>
      )}
    </ScrollShadow>
  );
};
