import { z } from "zod";

export type WalletToken = {
  balance: string;
  url: string;
  decimals: number;
  identifier: string;
  type: "ERC20" | "ETH";
};

export type Token = Omit<WalletToken, "balance">;
