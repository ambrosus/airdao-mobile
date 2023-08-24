import { DatabaseTable } from '@appTypes';
import Database from '@database/Database';
import { Model, Q } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';

export class WalletDBModel extends Model {
  static table = DatabaseTable.Wallets;

  // define fields
  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @text('mnemonic') mnemonic: string;
  // @ts-ignore
  @text('hash') hash: string;
  // @ts-ignore
  @field('number') number: number;
  // @ts-ignore
  @text('cashback') cashback: string;
  // @ts-ignore
  @field('is_backed_up') isBackedUp: number;
  // @ts-ignore
  @field('is_hide_transaction_for_free') isHideTransactionForFee: number;
  // @ts-ignore
  @field('allow_replace_by_fee') allowReplaceByFee: number;
  // @ts-ignore
  @field('use_legacy') useLegacy: number;
  // @ts-ignore
  @field('use_unconfirmed') useUnconfirmed: number;
  // @ts-ignore
  @field('is_hd') isHd: number;
  // @ts-ignore
  @field('is_created_here') isCreatedHere: number;
  // @ts-ignore
  @field('to_send_status') toSendStatus: number;
  // @ts-ignore
  @field('pub') pub: string;

  static async getByHash(hash: string): Promise<WalletDBModel | null> {
    const walletInDB = (await Database.query(
      this.table,
      Q.where('hash', Q.eq(hash))
    )) as WalletDBModel[];
    if (walletInDB && walletInDB.length > 0) return walletInDB[0];
    return null;
  }
}
