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
  from: string;
  to: string;
  hash: string;
  status: string;
  token?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
  };
}
