import { TransactionType } from '@appTypes/enums';
import { TransactionDTO } from './dtos/TransactionDTO';
import { ExplorerAccount } from './Explorer';

export class Transaction {
  _id: string;
  timestamp: Date;
  amount: number;
  fee: number;
  type: TransactionType;
  hash: string;
  from: ExplorerAccount | null;
  to: ExplorerAccount | null;
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

  constructor(details: TransactionDTO) {
    this._id = details._id;
    this.timestamp = new Date(details.timestamp * 1000);
    this.amount = details.value.ether;
    this.fee = details.gasCost.ether;
    this.type = details.type;
    this.hash = details.hash;
    this.from = details.from_id ? new ExplorerAccount(details.from_id) : null;
    this.to = details.to_id ? new ExplorerAccount(details.to_id) : null;
    this.status = details.status;
    this.value = details.value;
    this.gasCost = details.gasCost;
  }
}
