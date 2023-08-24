/* eslint-disable camelcase */
import { DatabaseTable } from '@appTypes';
import { Model } from '@nozbe/watermelondb';
import { text, field, relation } from '@nozbe/watermelondb/decorators';
import { WalletDBModel } from './wallet';
import { AccountDBModel } from './account';

export class AccountBalanceDBModel extends Model {
  static table = DatabaseTable.AccountBalances;

  // define relations
  // @ts-ignore
  @relation(DatabaseTable.Wallets, 'hash') hash: WalletDBModel;
  // @ts-ignore
  @relation(DatabaseTable.Accounts, 'account_id') account: AccountDBModel;

  // define fields
  // @ts-ignore
  @field('balance_fix') balanceFix: number;
  // @ts-ignore
  @text('balance_txt') balanceTxt: string;
  // @ts-ignore
  @field('unconfirmed_fix') unconfirmedFix: number;
  // @ts-ignore
  @text('unconfirmed_txt') unconfirmedTxt: string;
  // @ts-ignore
  @text('balance_provider') balanceProvider: number;
  // @ts-ignore
  @field('balance_scan_time') balanceScanTime: number;
  // @ts-ignore
  @text('balance_scan_error') balanceScanError: string;
  // @ts-ignore
  @text('balance_scan_log') balanceScanLog: string;
  // @ts-ignore
  @text('balance_scan_block') balanceScanBlock: string;
  // @ts-ignore
  @text('balance_staked_txt') balanceStakedTxt: string;
  // @ts-ignore
  @field('status') status: number;
  // @ts-ignore
  @text('currency_code') currencyCode: string;
}
