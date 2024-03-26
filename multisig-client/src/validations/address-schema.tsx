import { ethers } from "ethers";
import { z } from "zod";

export const AddressSchema = z
  .string()
  .min(1, "Address is required")
  .refine(
    (data) => {
      console.log("data", data);
      try {
        return ethers.utils.isAddress(data);
      } catch (error) {
        return false;
      }
    },
    {
      message: "Invalid address",
    }
  );
