import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const AccountBalancesTable = tableSchema({
  name: DatabaseTable.AccountBalances,
  columns: [
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
      type: 'string'
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
      name: 'balance_staked_txt',
      type: 'string'
    },
    {
      name: 'status',
      type: 'string'
    },
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'hash',
      type: 'string'
    },
    {
      name: 'account_id',
      type: 'string'
    }
  ]
});
