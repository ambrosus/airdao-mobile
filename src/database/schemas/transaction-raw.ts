import { tableSchema } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';

export const TransactionRawTable = tableSchema({
  name: DatabaseTable.TransactionRaw,
  columns: [
    {
      name: 'currency_code',
      type: 'string'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'transaction_unique_key',
      type: 'string'
    },
    {
      name: 'transaction_hash',
      type: 'number'
    },
    {
      name: 'transaction_raw',
      type: 'string'
    },
    {
      name: 'transaction_log',
      type: 'string'
    },
    {
      name: 'broadcast_log',
      type: 'string'
    },
    {
      name: 'created_at',
      type: 'number'
    },
    {
      name: 'updated_at',
      type: 'number'
    },
    {
      name: 'broadcast_updated',
      type: 'number'
    },
    {
      name: 'removed_at',
      type: 'number'
    },
    {
      name: 'is_removed',
      type: 'number'
    }
  ]
});
