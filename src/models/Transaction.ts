import { CryptoCurrencyCode } from '@appTypes';
import { TransactionType } from '@appTypes/enums';
import { TokenUtils } from '@utils';
import { TransactionDTO } from './dtos/TransactionDTO';

export interface TransactionTokenInfo {
  address: string;
  name?: string;
  symbol: string;
  decimals: number;
  totalSupply?: number;
  cryptoAmount: string;
  type?: 'ERC-20' | 'ERC-1155';
}

export class Transaction {
  _id: string;
  timestamp: Date;
  amount: number;
  fee: number;
  type: TransactionType;
  hash: string;
  from: string;
  to: string;
  status: string;
  value: {
    wei: string;
    ether: number;
    symbol: string;
  };
  gasCost?: {
    ether: number;
    wei: string;
  };
  token?: {
    address: string;
    name: string;
    symbol: CryptoCurrencyCode;
    decimals: number;
    totalSupply: number;
  };

  isSent?: boolean;

  constructor(details: TransactionDTO, tokenUtils: typeof TokenUtils) {
    this._id = details._id;
    this.timestamp = new Date(details.timestamp * 1000);
    this.amount = details.value.ether;
    this.fee = details.gasCost.ether;
    this.type = details.type;
    this.hash = details.hash;
    this.from = details.from;
    this.to = details.to;
    this.status = details.status;
    this.value = { ...details.value, symbol: details.value.symbol || 'ASC' };
    this.gasCost = details.gasCost;
    if (details.token) {
      // @ts-ignore
      const { name, symbol } = tokenUtils.getTokenDetails(
        details.token.address
      );
      this.token = {
        ...details.token,
        name,
        symbol
      };
    }
  }

  get symbol(): CryptoCurrencyCode {
    return this.token?.symbol || (this.value?.symbol as CryptoCurrencyCode);
  }
}
