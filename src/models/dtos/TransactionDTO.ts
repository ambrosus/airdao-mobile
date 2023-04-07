import { TransactionType } from '@appTypes/enums';

export interface TransactionDTO {
  _id: string;
  type: TransactionType;
  timestamp: number;
  value: {
    wei: string;
    ether: number;
  };
  gasCost: {
    wei: string;
    ether: number;
  };
}
