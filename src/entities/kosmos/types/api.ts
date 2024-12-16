import { TxType } from '@entities/kosmos/types';

export interface ApiPricesResponse {
  price: number;
  timestamp: number;
}

export interface TransactionListItem {
  index: number;
  item: {
    id: string;
    transaction: TxType;
  };
}
