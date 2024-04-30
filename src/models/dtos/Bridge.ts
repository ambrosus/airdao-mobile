export interface BridgeTransactionDTO {
  _id: string;
  blockHash: string;
  from: string;
  to: string;
  gasCost: {
    wei: string;
    ether: number;
  };
  gasPrice: number;
  gasSent: number;
  gasUsed: number;
  hash: string;
  input: string;
  logs: unknown;
  nonce: number;
  status: string;
  timestamp: number;
  transactionIndex: number;
  type: string;
  parent: unknown;
  value: {
    wei: string;
    ether: number;
    symbol?: string;
  };
  token?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
  };
}

export interface BridgeTransactionHistoryDTO extends BridgeTransactionDTO {
  hasInners: boolean;
  inners?: BridgeTransactionDTO[];
}
