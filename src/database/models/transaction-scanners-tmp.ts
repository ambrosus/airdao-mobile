/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';

export class TransactionScannersTmpDBModel extends Model {
  static table = DatabaseTable.TransactionScannersTmp;

  // define fields
  // @ts-ignore
  @text('currency_code') name: string;
  // @ts-ignore
  @text('address') address: string;
  // @ts-ignore
  @text('tmp_key') tmp_key: string;
  // @ts-ignore
  @text('tmp_sub_key') tmp_sub_key: string;
  // @ts-ignore
  @text('tmp_val') tmp_val: string;
  // @ts-ignore
  @field('created_at') created_at: number;
}
