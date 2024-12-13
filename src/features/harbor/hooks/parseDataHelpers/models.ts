import { TransactionDTO } from '@models';

export interface ProccessModel {
  transaction?: TransactionDTO;
  error?: unknown;
}
