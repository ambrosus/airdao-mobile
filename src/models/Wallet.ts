import { WalletMetadata } from '@appTypes';

export class Wallet {
  hash: string;
  name: string;
  mnemonic: string;
  number: number;
  createdAt: Date;

  constructor(details: WalletMetadata) {
    this.hash = details.hash || '';
    this.name = details.name;
    this.mnemonic = details.mnemonic;
    this.number = details.number;
    this.createdAt = details.createdAt
      ? new Date(details.createdAt)
      : new Date();
  }
}
