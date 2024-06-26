export interface BridgeTransactionTokenDestination {
  name: string;
  decimals?: number;
  denomination?: number;
  isNative?: boolean;
  address: string;
}

export interface BridgeTransactionHistoryDTO {
  eventId: string | number;
  networkFrom: string;
  networkTo: string;
  tokenFrom: BridgeTransactionTokenDestination;
  tokenTo: BridgeTransactionTokenDestination;
  userTo: string;
  amount: number;
  decimalAmount: string;
  denominatedAmount: string;
  fee: string;
  withdrawTx: string;
  timestampStart: number;
  transferFinishTxHash: string;
}
