import { ExplorerAccountType } from '@appTypes/enums';
import { ExplorerAccount } from '@models/Explorer';

export const MockExplorerAccount: ExplorerAccount = {
  _id: 'test',
  address: 'test',
  ambBalance: 1000,
  transactionCount: 200,
  type: ExplorerAccountType.Account,
  name: 'Test Account',
  isOnWatchlist: true,
  isPersonal: true,
  calculatePercentHoldings: function (): number {
    return 0;
  }
};
