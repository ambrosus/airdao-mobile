import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const WalletPubTable = tableSchema({
  name: DatabaseTable.WalletPub,
  columns: [
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'wallet_hash',
      type: 'string'
    },
    {
      name: 'wallet_pub_type',
      type: 'string'
    },
    {
      name: 'wallet_pub_value',
      type: 'string'
    },
    {
      name: 'wallet_pub_last_index',
      type: 'number'
    },
    {
      name: 'status',
      type: 'number'
    },
    {
      name: 'balance_fix',
      type: 'number'
    },
    {
      name: 'balance_txt',
      type: 'string'
    },
    {
      name: 'unconfirmed_fix',
      type: 'number'
    },
    {
      name: 'unconfirmed_txt',
      type: 'string'
    },
    {
      name: 'balance_provider',
      type: 'string'
    },
    {
      name: 'balance_scan_time',
      type: 'number'
    },
    {
      name: 'balance_scan_error',
      type: 'string'
    },
    {
      name: 'balance_scan_log',
      type: 'string'
    },
    {
      name: 'balance_scan_block',
      type: 'string'
    },
    {
      name: 'transactions_scan_time',
      type: 'number'
    },
    {
      name: 'transactions_scan_log',
      type: 'string'
    },
    { name: 'hash', type: 'string' }
  ]
});
