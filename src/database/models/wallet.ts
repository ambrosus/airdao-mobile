import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export class WalletDBModel extends Model {
  static table = DatabaseTable.Wallets;

  // define fields
  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @text('address') address: string;
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
}
