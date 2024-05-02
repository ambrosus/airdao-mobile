interface BridgeTransactionTokenDestination {
  name: string;
  denomination: number;
  isNative?: boolean;
  address: string;
}

export interface BridgeTransactionHistoryDTO {
  eventId: string;
  networkFrom: string;
  networkTo: string;
  tokenFrom: BridgeTransactionTokenDestination;
  tokenTo: BridgeTransactionTokenDestination;
  userTo: string;
  amount: number;
  denominatedAmount: string;
  fee: string;
  withdrawTx: string;
  timestampStart: number;
  transferFinishTxHash: string;
}
