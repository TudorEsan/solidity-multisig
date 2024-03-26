import { z } from "zod";
import BigNumber from "bignumber.js";

import { AddressSchema } from "./address-schema";
import { WalletTokenWithPriceSchema } from "./wallet-token-with-price-schema";

export const SendTokenSchema = WalletTokenWithPriceSchema.extend({
  toAddress: AddressSchema,
}).refine(
  (data) => {
    if (!data?.token) {
      return false;
    }
    const { token } = data;
    const { balance, decimals } = token;
    return BigNumber(data.amount).times(decimals).lte(balance);
  },
  { path: ["amount"], message: "Insufficient balance" }
);

export type SendTokenSchema = z.infer<typeof SendTokenSchema>;
