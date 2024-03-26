import BigNumber from "bignumber.js";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Spinner } from "@nextui-org/react";
import { z } from "zod";
import { Utils } from "@pulsar.money/core";

import { Button } from "@/components/ui/button";
import { SendTokenSchema } from "@/components/schemas/send-token-schema";
import { WalletTokenSchema } from "@/components/schemas/wallet-token-schema";
import { WalletToken } from "@/types/token.type";
import { useGetTokenPrice } from "@/hooks/useGetTokenPrice";
import { sanitizeNumberInput } from "@/helpers/sanitizer";
import {
  maxNumberFormater,
  shortNumberFormater,
} from "@/helpers/numberFormaters";
import { ethers } from "ethers";
import { StyledNumber } from "@/components/styled-number";
import { SwitchIcon } from "@radix-ui/react-icons";
import { ControlledTokenSelectModal } from "./controlled-token-select-modal";
import { ErrorMessage } from "../error-message";
import { ControlledInput } from "./controlled-input-shad";

interface AutoResizeInputProps {
  name: "amount" | "priceUsd";
  label?: string;
  onChange?: (value: string) => string;
}

const AutoResizeInput = ({ name, label, onChange }: AutoResizeInputProps) => {
  const watch = useWatch<SendTokenSchema>();
  const value = watch[name];
  const minFontSize = 16;
  const maxWidth = 120;
  const characters = value?.length ?? 0;
  const [width, setWidth] = useState(Math.min(30 + characters * 10, maxWidth));
  const [fontSize, setFontSize] = useState(
    Math.max(36 - characters * 2, minFontSize)
  );

  useEffect(() => {
    const newFontSize = Math.max(36 - characters * 2, minFontSize);
    const newWidth = Math.min(30 + characters * 10, maxWidth);
    setWidth(newWidth);
    setFontSize(newFontSize);
  }, [value]);

  return (
    <div className="w-40 h-10 flex gap-1 justify-center items-center">
      <ControlledInput
        withoutErrorMessage
        inputStyles="border-none shadow-none text-right font-bold w-full  p-0 border-0  focus-visible:ring-0"
        valueFormatter={onChange}
        id={name}
        style={{
          fontSize: `${fontSize}px`,
          width: `${width}px`,
        }}
        placeholder="0"
        type="decimal"
        name={name}
      />
      <label
        htmlFor={name}
        className="font-bold "
        style={{
          fontSize: `${fontSize}px`,
        }}
      >
        {label}
      </label>
    </div>
  );
};

const FormValues = z.object({
  amount: z.string(),
  priceUsd: z.string(),
  token: WalletTokenSchema,
});

type FormValues = z.infer<typeof FormValues>;

interface SelectWalletTokenAmountWidgetProps {
  next: () => void;
  walletTokens: WalletToken[];
  isLoading?: boolean;
}

// TODO: refactor this and split it into smaller components
export const SelectWalletTokenAmountWidget = ({
  next,
  walletTokens,
  isLoading,
}: SelectWalletTokenAmountWidgetProps) => {
  const form = useFormContext<FormValues>();
  const { token } = form.watch();
  const { amount, priceUsd } = form.watch();
  const [showPrice, setShowPrice] = useState(false);
  const selectedTokenIdentifier = token?.identifier.split("-")[0] ?? "";
  const tokenPrice = useGetTokenPrice(token?.identifier ?? "");
  const controls = useAnimation();

  const onChangePrice = (value: string) => {
    const numericValue = sanitizeNumberInput(value);

    const price = tokenPrice.data;
    if (!price) return numericValue;

    const parsedValue = new BigNumber(numericValue);
    if (parsedValue.isNaN()) {
      form.setValue("amount", "");
      return numericValue;
    }

    const tokenAmount = parsedValue.div(price);
    form.setValue("amount", Utils.Number.bigNumberToPrettyString(tokenAmount));
    return numericValue;
  };

  const onChangeAmount = (value: string) => {
    const numericValue = sanitizeNumberInput(value);

    const price = tokenPrice.data;
    if (!price) return numericValue;

    const parsedValue = new BigNumber(numericValue);
    if (parsedValue.isNaN()) {
      form.setValue("priceUsd", "");
      return numericValue;
    }

    const priceUsd = parsedValue.times(price);
    form.setValue("priceUsd", Utils.Number.bigNumberToPrettyString(priceUsd));
    return numericValue;
  };

  const handleNext = async () => {
    const hasEnoughBalance = BigNumber(amount)
      .times(10 ** (token?.decimals ?? 1))
      .lte(token?.balance ?? 0);
    if (hasEnoughBalance) {
      next();
    } else {
      form.setError("amount", {
        message: "Not enough balance",
      });
      controls.start({
        rotate: [0, 3, -3, 3, 0],
        transition: { duration: 0.4 },
      });
    }
  };

  const secondaryLabel = useMemo(() => {
    if (showPrice) {
      return selectedTokenIdentifier;
    }
    return "USD";
  }, [showPrice, token]);

  const handleMax = () => {
    let balance = BigNumber(
      maxNumberFormater(
        ethers.utils.formatUnits(token?.balance, token?.decimals)
      )
    );
    if (token.identifier === "ETH") {
      balance = balance.minus(0.005);
    }

    if (balance.lte(0)) {
      balance = BigNumber(0);
    }

    const balanceStr = Utils.Number.bigNumberToPrettyString(balance);
    const usdValue = maxNumberFormater(balance.times(tokenPrice.data ?? 0));

    form.setValue("priceUsd", usdValue);
    form.setValue("amount", balanceStr);
  };

  const secondaryValue = useMemo(() => {
    if (showPrice) {
      return amount || 0;
    }
    return priceUsd || 0;
  }, [showPrice, amount, priceUsd]);

  useEffect(() => {
    const price = tokenPrice.data;
    if (!price || !priceUsd) {
      form.setValue("amount", "");
      form.setValue("priceUsd", "");
      return;
    }
    if (showPrice) {
      form.setValue(
        "amount",
        Utils.Number.bigNumberToPrettyString(BigNumber(priceUsd).div(price))
      );
    } else {
      form.setValue(
        "priceUsd",
        Utils.Number.bigNumberToPrettyString(BigNumber(amount).times(price))
      );
    }
  }, [tokenPrice.data, token]);

  if (tokenPrice.isLoading || isLoading) {
    return (
      <div className="h-[312px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  mx-auto w-full">
      <div className="flex justify-between w-full max-w-xs  gap-1 my-10">
        <Button
          size="icon"
          variant="secondary"
          className="w-10 h-10 flex-shrink-0"
          type="button"
          onClick={handleMax}
        >
          MAX
        </Button>
        <div className="flex flex-col">
          {showPrice && tokenPrice.data && (
            <AutoResizeInput
              onChange={onChangePrice}
              name="priceUsd"
              label="USD"
            />
          )}
          {!showPrice && (
            <AutoResizeInput
              onChange={onChangeAmount}
              name="amount"
              label={selectedTokenIdentifier}
            />
          )}
          <div className="h-7">
            {!!tokenPrice.data && (
              <p className="text-lg gap-1 text-center flex items-baseline justify-center">
                <StyledNumber
                  numberStyles="inline-block max-w-[120px] truncate"
                  fractionStyles="text-sm"
                  number={secondaryValue}
                  withoutShortNumber
                  digits={5}
                />
                <span>{secondaryLabel}</span>
              </p>
            )}
          </div>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="w-10 h-10 flex-shrink-0"
          type="button"
          onClick={() => setShowPrice(!showPrice)}
          disabled={!tokenPrice.data}
        >
          <SwitchIcon className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex flex-col mb-5">
        <ControlledTokenSelectModal
          select={{
            tokens: walletTokens ?? [],
            name: "token",
          }}
        />
        <p className="text-center text-muted-foreground text-sm">
          {shortNumberFormater(
            ethers.utils.formatUnits(token?.balance, token?.decimals)
          )}{" "}
          {selectedTokenIdentifier}
        </p>
      </div>
      <motion.div className="w-full max-w-xs mt-8" animate={controls}>
        <Button
          className="w-full"
          disabled={!amount || !token}
          onClick={handleNext}
          type="button"
        >
          Continue
        </Button>
      </motion.div>
      <ErrorMessage
        className="mt-4"
        message={form.formState.errors.amount?.message}
      />
    </div>
  );
};
