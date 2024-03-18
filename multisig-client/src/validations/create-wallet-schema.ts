"use client";
import { z } from "zod";

const createWalletSchema = z.object({
  name: z.string(),
  addresses: z.array(z.object({ address: z.string() })),
  threshold: z.coerce.number(),
});
export type CreateWalletForm = z.infer<typeof createWalletSchema>;
