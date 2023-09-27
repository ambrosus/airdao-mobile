import { TransactionType } from '@appTypes/enums';
import { ExplorerAccountDTO } from './Explorer';

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
  from_id: ExplorerAccountDTO;
  to_id: ExplorerAccountDTO;
  hash: string;
  status: string;
}
