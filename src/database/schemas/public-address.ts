import { tableSchema } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';

export const PublicAddressesTable = tableSchema({
  name: DatabaseTable.PublicAddresses,
  columns: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'is_watchlisted',
      type: 'boolean'
    },
    {
      name: 'group_id',
      type: 'string',
      isIndexed: true
    } // Foreign key to the 'public addresses list' table
  ]
});
