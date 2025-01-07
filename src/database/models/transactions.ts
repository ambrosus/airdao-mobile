/* eslint-disable camelcase */
import { Model } from '@nozbe/watermelondb';
import { text, field } from '@nozbe/watermelondb/decorators';
import { DatabaseTable } from '@appTypes';

export class TransactionsDBModel extends Model {
  static table = DatabaseTable.Transactions;

  // define fields
  // @ts-ignore
  @text('currency_code') currencyCode: string;
  // @ts-ignore
  @text('hash') hash: string;
  // @ts-ignore
  @field('account_id') accountId: number;
  // @ts-ignore
  @text('transaction_hash') transactionHash: string;
  // @ts-ignore
  @text('transaction_hash_basic') transactionHashBasic: string;
  // @ts-ignore
  @text('block_hash') blockHash: string;
  // @ts-ignore
  @field('block_number') blockNumber: number;
  // @ts-ignore
  @field('block_confirmations') blockConfirmations: number;
  // @ts-ignore
  @text('transaction_status') transactionStatus: string;
  // @ts-ignore
  @text('transaction_direction') transactionDirection: string;
  // @ts-ignore
  @field('transaction_of_airdao_wallet') transactionOfAirDAOWallet: number;
  // @ts-ignore
  @text('address_to') addressTo: string;
  // @ts-ignore
  @text('address_to_basic') addressToBasic: string;
  // @ts-ignore
  @text('address_from') addressFrom: string;
  // @ts-ignore
  @text('address_from_basic') addressFromBasic: string;
  // @ts-ignore
  @field('address_from_basic') addressFromBasic: string;
  // @ts-ignore
  @field('address_amount') addressAmount: string;
  // @ts-ignore
  @text('transaction_fee_currency_code') transactionFeeCurrencyCode: string;
  // @ts-ignore
  @text('transaction_filter_type') transactionFilterType: string;
  // @ts-ignore
  @text('vout') vout: string;
  // @ts-ignore
  @text('vin') vin: string;
  // @ts-ignore
  @field('input_value') inputValue: number;
  // @ts-ignore
  @text('transaction_json') transactionJSON: string;
  // @ts-ignore
  @field('transactions_scan_time') transactions_scan_time: number;
  // @ts-ignore
  @text('transactions_scan_log') transactionScanLog: string;
  // @ts-ignore
  @text('transactions_other_hashes') transactionsOtherHashes: string;
  // @ts-ignore
  @text('bse_order_id') bseOrderId: string;
  // @ts-ignore
  @text('bse_order_id_in') bseOrderIdIn: string;
  // @ts-ignore
  @text('bse_order_id_out') bseOrderIdOut: string;
  // @ts-ignore
  @text('bse_order_data') bseOrderData: string;
  // @ts-ignore
  @field('lock_time') lockTime: number;
  // @ts-ignore
  @field('block_time') blockTime: number;
  // @ts-ignore
  @field('created_at') createdAt: number;
  // @ts-ignore
  @field('mined_at') minedAt: number;
  // @ts-ignore
  @field('updated_at') updatedAt: number;
  // @ts-ignore
  @field('hidden_at') hiddenAt: number;
  // @ts-ignore
  @text('special_action_needed') specialActionNeeded: string;
}
