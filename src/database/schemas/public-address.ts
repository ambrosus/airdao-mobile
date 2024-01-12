import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

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
    }
  ]
});
