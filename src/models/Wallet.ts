import { WalletMetadata } from '@appTypes';

export class Wallet {
  hash: string;
  name: string;
  mnemonic: string;
  createdAt: Date;

  constructor(details: WalletMetadata) {
    this.hash = details.hash;
    this.name = details.name;
    this.mnemonic = details.mnemonic;
    this.createdAt = details.createdAt
      ? new Date(details.createdAt)
      : new Date();
  }
}
