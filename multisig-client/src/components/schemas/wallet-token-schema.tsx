import { z } from "zod";

export const WalletTokenSchema = z.object({
  balance: z.string(),
  decimals: z.number(),
  identifier: z.string(),
  type: z.string(),
});

export type WalletTokenSchema = z.infer<typeof WalletTokenSchema>;
