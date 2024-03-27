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

export type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};
