import { TxType } from './transaction';

export interface TransactionListItem {
  index: number;
  item: {
    id: string;
    transaction: TxType;
  };
}
