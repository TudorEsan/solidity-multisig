export class Routes {
  static dashboard() {
    return "/dashboard";
  }

  static create() {
    return "/create";
  }

  static login() {
    return "/login";
  }

  static wallets() {
    return "/wallets";
  }

  static transactions() {
    return "/transactions";
  }

  static transaction(transactionId: string) {
    return `/transactions/${transactionId}`;
  }

  static atlas() {
    return "/atlas";
  }
}
