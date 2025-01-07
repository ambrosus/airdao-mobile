import { tableSchema } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';

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
