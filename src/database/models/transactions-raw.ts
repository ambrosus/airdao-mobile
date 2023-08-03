/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';

export class TransactionRawDBModel extends Model {
  static table = DatabaseTable.TransactionRaw;

  // define fields
  // @ts-ignore
  @text('currency_code') currency_code: string;
  // @ts-ignore
  @text('address') address: string;
  // @ts-ignore
  @text('transaction_unique_key') transactionUniqueKey: string;
  // @ts-ignore
  @text('transaction_hash') transactionHash: string;
  // @ts-ignore
  @text('transaction_raw') transactionRaw: string;
  // @ts-ignore
  @text('transaction_log') transactionLog: string;
  // @ts-ignore
  @text('broadcast_log') broadcastLog: string;
  // @ts-ignore
  @field('created_at') createdAt: number;
  // @ts-ignore
  @field('updated_at') updatedAt: number;
  // @ts-ignore
  @field('broadcast_updated') broadcastUpdated: number;
  // @ts-ignore
  @field('removed_at') removedAt: number;
  // @ts-ignore
  @field('is_removed') isRemoved: number;
}
