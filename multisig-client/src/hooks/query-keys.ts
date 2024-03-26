export class QueryKeys {
  static tokenPrice = (identifier: string) => ["token", "price", identifier];
  static tokensPrices = () => ["tokens", "prices"];
}
