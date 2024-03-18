import { z } from "zod";

export const WalletSchema = z
  .object({
    owners: z.array(z.string()),
    threshold: z.number(),
    chain: z.number(),
    name: z.string(),
  })
  .refine((data) => {
    return data.owners.length >= data.threshold;
  });

export type WalletSchema = z.infer<typeof WalletSchema>;
