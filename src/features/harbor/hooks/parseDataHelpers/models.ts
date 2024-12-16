import { TransactionDTO } from '@models';

export interface ProcessModel {
  transaction?: TransactionDTO;
  error?: unknown;
  processStatus?: any;
}
