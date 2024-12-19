/* eslint-disable camelcase */
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';
import { DatabaseTable } from '@appTypes';

export class TransactionScannersTmpDBModel extends Model {
  static table = DatabaseTable.TransactionScannersTmp;

  // define fields
  // @ts-ignore
  @text('currency_code') currencyCode: string;
  // @ts-ignore
  @text('address') address: string;
  // @ts-ignore
  @text('tmp_key') tmpKey: string;
  // @ts-ignore
  @text('tmp_sub_key') tmpSubKey: string;
  // @ts-ignore
  @text('tmp_val') tmpVal: string;
  // @ts-ignore
  @field('created_at') createdAt: number;
}
