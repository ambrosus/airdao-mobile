import { TransactionType } from '@appTypes/enums';

export interface TransactionDTO {
  _id: string;
  type: TransactionType;
  timestamp: number;
  value: {
    wei: string;
    ether: number;
    symbol: string;
  };
  gasCost: {
    wei: string;
    ether: number;
  };
  token?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
  };
  from: string;
  to: string;
  hash: string;
  status: string;
}

export interface TokenTransactionDTO extends TransactionDTO {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
  };
}
