/* eslint-disable camelcase */
import { Model } from '@nozbe/watermelondb';
import { text, field, relation } from '@nozbe/watermelondb/decorators';
import { DatabaseTable } from '@appTypes';
import { WalletDBModel } from './wallet';

export class WalletPubDBModel extends Model {
  static table = DatabaseTable.WalletPub;

  // define fields

  // @ts-ignore
  @text('currency_code') currency_code: string;
  // @ts-ignore
  @relation(DatabaseTable.Wallets, 'hash') hash: WalletDBModel;
  // @ts-ignore
  @text('wallet_pub_type') walletPubType: string;
  // @ts-ignore
  @text('wallet_pub_value') walletPubValue: string;
  // @ts-ignore
  @field('wallet_pub_last_index') walletPubLastIndex: number;
  // @ts-ignore
  @field('status') status: number;
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
  @field('transactions_scan_time') transactionsScanTime: number;
  // @ts-ignore
  @text('transactions_scan_log') transactionsScanLog: string;
}
