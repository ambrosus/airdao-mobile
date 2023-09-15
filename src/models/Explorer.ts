import { CacheableAccount, ExplorerAccountType } from '@appTypes';
import { ExplorerAccountDTO, ExplorerInfoDTO } from './dtos';
import { AccountDBModel } from '@database';

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

  static fromDBModel(from: AccountDBModel): ExplorerAccount {
    return new ExplorerAccount({
      _id: from.id,
      address: from.address,
      balance: {
        wei: '0',
        ether: 0
      },
      byteCode: '',
      isContract: false,
      power: 0,
      role: 0,
      timestamp: new Date().getTime(),
      totalTx: 0,
      type: ExplorerAccountType.Account
    });
  }
}
