import { z } from "zod";

export const WalletTokenSchema = z.object({
  balance: z.string(),
  decimals: z.number(),
  identifier: z.string(),
  type: z.string(),
  url: z.string().optional(),
});

export type WalletTokenSchema = z.infer<typeof WalletTokenSchema>;
