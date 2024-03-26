export interface Contacts {
  address: string;
  herotag?: string;
}

export interface SubmitedTransaction {
  to: string;
  amount: string;
  data: string;
  executed: boolean;
  numConfirmations: string;
}
