import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const WalletTable = tableSchema({
  name: DatabaseTable.Wallets,
  columns: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'hash',
      type: 'string'
    },
    {
      name: 'number',
      type: 'number'
    },
    {
      name: 'cashback',
      type: 'string'
    },
    {
      name: 'is_backed_up',
      type: 'number'
    },
    {
      name: 'is_hide_transaction_for_free',
      type: 'number'
    },
    {
      name: 'allow_replace_by_fee',
      type: 'number'
    },
    {
      name: 'use_legacy',
      type: 'number'
    },
    {
      name: 'use_unconfirmed',
      type: 'number'
    },
    {
      name: 'is_hd',
      type: 'number'
    },
    {
      name: 'is_created_here',
      type: 'number'
    },
    {
      name: 'to_send_status',
      type: 'number'
    }
  ]
});
