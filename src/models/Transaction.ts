import { TransactionType } from '@appTypes/enums';
import { TransactionDTO } from './dtos/TransactionDTO';

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
  isSent?: boolean;

  constructor(details: TransactionDTO) {
    this._id = details._id;
    this.timestamp = new Date(details.timestamp * 1000);
    this.amount = details.value.ether;
    this.fee = details.gasCost.ether;
    this.type = details.type;
    this.hash = details.hash;
    this.from = details.from;
    this.to = details.to;
    this.status = details.status;
    this.value = details.value;
    this.gasCost = details.gasCost;
  }
}
