import { ExplorerAccount } from './Explorer';

type AccountListConstructor = {
  id: string;
  name: string;
  accounts: ExplorerAccount[];
};

export class AccountList {
  id: string;
  name: string;
  accounts: ExplorerAccount[];

  constructor(details: AccountListConstructor) {
    this.id = details.id;
    this.name = details.name;
    this.accounts = details.accounts || [];
  }

  get accountCount(): number {
    return this.accounts.length;
  }

  // returns total AMB Balance
  get totalBalance(): number {
    return this.accounts.reduce((prev, cur) => prev + cur.ambBalance, 0);
  }
}
