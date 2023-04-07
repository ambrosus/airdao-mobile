import { TransactionType } from '@appTypes/enums';
import { TransactionDTO } from './dtos/TransactionDTO';

export class Transaction {
  _id: string;
  timestamp: Date;
  amount: number;
  fee: number;
  type: TransactionType;
  constructor(details: TransactionDTO) {
    this._id = details._id;
    this.timestamp = new Date(details.timestamp * 1000);
    this.amount = details.value.ether;
    this.fee = details.gasCost.ether;
    this.type = details.type;
  }
}
