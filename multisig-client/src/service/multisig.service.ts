import { Wallet } from "@/db/drizzle";
import { WalletSchema } from "@/validations/wallet.schama";
import axios from "axios";

/**
 * Service class for interacting with the multisig functionality.
 */
export class MultisigService {
  /**
   * Adds a wallet to the multisig service.
   * 
   * @param data - The wallet data to be added.
   * @returns A promise that resolves to the response from the server.
   */
  static addWallet = async (data: WalletSchema) => {
    const resp = axios.post<Wallet>("/api/users", data);
    return resp;
  };
}
