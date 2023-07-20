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
      name: 'mnemonic',
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
    { name: 'created_at', type: 'number' }
  ]
});
