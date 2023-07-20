import { DatabaseTable } from '@appTypes';
import { Wallet } from '@models/Wallet';
import { Model } from '@nozbe/watermelondb';
import { text, date, readonly, field } from '@nozbe/watermelondb/decorators';

export class WalletDBModel extends Model {
  static table = DatabaseTable.Wallets;

  // define fields
  @text('name') name?: string;
  @text('hash') hash?: string;
  @text('mnemonic') mnemonic?: string;
  @field('number') number?: number;
  @readonly @date('created_at') createdAt?: Date;

  hydrate(): Wallet {
    return {
      _id: this.id,
      hash: this.hash || '',
      name: this.name || '',
      mnemonic: this.mnemonic || '',
      number: this.number || 0,
      createdAt: this.createdAt ? new Date(this.createdAt) : new Date()
    };
  }
}
