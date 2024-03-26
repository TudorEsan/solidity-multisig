import { ethers } from "ethers";
import { z } from "zod";

export const AddressSchema = z
  .string()
  .min(1, "Address is required")
  .refine((data) => ethers.utils.isAddress(data), {
    message: "Invalid address",
  });
