import { ExplorerInfoDTO } from './dtos';

export class ExplorerInfo {
  totalAddresses: number;
  totalHolders: number;

  constructor(details: ExplorerInfoDTO) {
    this.totalAddresses = details.accounts.total;
    this.totalHolders = details.accounts.withBalance;
  }
}
