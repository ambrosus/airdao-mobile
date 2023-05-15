import { TransactionType } from '@appTypes/enums';
import { Transaction } from '@models/Transaction';
import { MockExplorerAccount } from './ExplorerAccount.mock';

export const MockTransaction: Transaction = {
  _id: 'test_transaction',
  timestamp: new Date(),
  amount: 100,
  fee: 1,
  type: TransactionType.Transfer,
  hash: 'test_transaction_hash',
  from: MockExplorerAccount,
  to: MockExplorerAccount
};
