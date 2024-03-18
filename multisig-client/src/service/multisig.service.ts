import { Wallet } from "@/db/drizzle";
import { WalletSchema } from "@/validations/wallet.schama";
import axios from "axios";

export class MultisigService {
  static addWallet = async (data: WalletSchema) => {
    const resp = axios.post<Wallet>("/api/users", data);
    return resp;
  };
}
