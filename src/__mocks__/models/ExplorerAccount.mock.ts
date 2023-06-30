import { ExplorerAccountType } from '@appTypes/enums';
import { ExplorerAccount } from '@models/Explorer';

export const MockExplorerAccount: ExplorerAccount = {
  _id: '6458d664d186ad9c72f3779c',
  address: '0x19690E7267Adf28c11494248C3d5561bb7aeDBbA',
  ambBalance: 1000,
  transactionCount: 200,
  type: ExplorerAccountType.Account,
  name: 'Test Account',
  isOnWatchlist: true,
  isPersonal: true,
  calculatePercentHoldings: () => 0
};
