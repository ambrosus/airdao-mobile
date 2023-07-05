import { CacheableAccount, ExplorerAccountType } from '@appTypes';
import { ExplorerAccountDTO, ExplorerInfoDTO } from './dtos';

export class ExplorerInfo {
  totalAddresses: number;
  totalHolders: number;
  totalSupply: number;

  constructor(details: ExplorerInfoDTO) {
    this.totalAddresses = details.accounts.total;
    this.totalHolders = details.accounts.withBalance;
    this.totalSupply = details.totalSupply;
  }
}

export class ExplorerAccount implements CacheableAccount {
  _id: string;
  address: string;
  ambBalance: number;
  transactionCount: number;
  type: ExplorerAccountType;
  name: string;
  isOnWatchlist?: boolean | undefined;

  constructor(details: ExplorerAccountDTO) {
    this._id = details._id;
    this.address = details.address;
    this.ambBalance = details.balance?.ether || 0;
    this.transactionCount = details.totalTx;
    this.type = details.type;
    this.name = '';
  }

  calculatePercentHoldings(totalSupply: number): number {
    return (this.ambBalance / totalSupply) * 100;
  }

  static toCacheable(from: ExplorerAccount): CacheableAccount {
    return {
      name: from.name,
      address: from.address,
      isOnWatchlist: from.isOnWatchlist
    };
  }
}
