import { z } from "zod";
import { WalletTokenSchema } from "./wallet-token-schema";

export const WalletTokenWithPriceSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((data) => !Number.isNaN(Number(data)), {
      message: "Amount is required",
    })
    .refine((data) => Number(data) > 0, {
      message: "Amount must be greater than 0",
    }),
  priceUsd: z.string(),
  token: WalletTokenSchema,
});

export type WalletTokenWithPriceSchema = z.infer<
  typeof WalletTokenWithPriceSchema
>;
