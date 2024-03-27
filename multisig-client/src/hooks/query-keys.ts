export class QueryKeys {
  static tokenPrice = (identifier: string) => ["token", "price", identifier];
  static tokensPrices = () => ["tokens", "prices"];
  static getTransactionHash = (id: string) => ["transaction", id];
  static getTranasctionHistory = (id: string) => ["transaction", "history", id];
}
