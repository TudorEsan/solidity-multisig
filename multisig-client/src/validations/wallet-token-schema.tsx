import { z } from "zod";

export const WalletTokenSchema = z.object({
  balance: z.string(),
  decimals: z.number(),
  identifier: z.string(),
  type: z.string(),
  url: z.string().isOptional(),
});

export type WalletTokenSchema = z.infer<typeof WalletTokenSchema>;
