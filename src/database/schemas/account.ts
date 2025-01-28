import { tableSchema } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';

export const AccountsTable = tableSchema({
  name: DatabaseTable.Accounts,
  columns: [
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'derivation_path',
      type: 'string'
    },
    {
      name: 'derivation_index',
      type: 'number'
    },
    {
      name: 'derivation_type',
      type: 'string'
    },
    {
      name: 'already_shown',
      type: 'number'
    },
    {
      name: 'wallet_pub_id',
      type: 'number'
    },

    {
      name: 'status',
      type: 'number'
    },
    {
      name: 'is_main', // default 1
      type: 'number'
    },
    {
      name: 'transactions_scan_time',
      type: 'number'
    },
    {
      name: 'transactions_scan_error',
      type: 'string'
    },
    {
      name: 'transactions_scan_log',
      type: 'string'
    },
    {
      name: 'changes_log',
      type: 'string'
    },
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'hash',
      type: 'string'
    }
  ]
});
