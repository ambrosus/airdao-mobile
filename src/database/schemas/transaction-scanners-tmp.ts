import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const TransactionScannersTmpTable = tableSchema({
  name: DatabaseTable.TransactionScannersTmp,
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
      name: 'tmp_key',
      type: 'string'
    },
    {
      name: 'tmp_sub_key',
      type: 'number'
    },
    {
      name: 'tmp_val',
      type: 'string'
    },
    {
      name: 'created_at',
      type: 'number'
    }
  ]
});
