/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field, relation } from '@nozbe/watermelondb/decorators';
import { WalletDBModel } from './wallet';

export class AccountDBModel extends Model {
  static table = DatabaseTable.Accounts;

  // define fields

  // @ts-ignore
  @text('address') address: string;
  // @ts-ignore
  @relation(DatabaseTable.Wallets, 'hash') wallet: WalletDBModel;
  // @ts-ignore
  @text('name') name: string;
  // @ts-ignore
  @text('derivation_path') derivationPath: string;
  // @ts-ignore
  @field('derivation_index') derivationIndex: number;
  // @ts-ignore
  @text('derivation_type') derivationType: string;
  // @ts-ignore
  @field('already_shown') alreadyShown: number;
  // @ts-ignore
  @field('wallet_pub_id') walletPubId: number;
  // @ts-ignore
  @field('status') status: number;
  // @ts-ignore
  @field('is_main') isMain: number;
  // @ts-ignore
  @field('transactions_scan_time') transactionsScanTime: number;
  // @ts-ignore
  @text('transactions_scan_log') transactionsScanLog: string;
  // @ts-ignore
  @text('transactions_scan_error') transactionsScanError: string;
  // @ts-ignore
  @text('changes_log') changesLog: string;
  // @ts-ignore
  @text('currency_code') currencyCode: string;
}
