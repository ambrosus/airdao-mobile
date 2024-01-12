import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const PublicAddressListsTable = tableSchema({
  name: DatabaseTable.PublicAddressLists,
  columns: [
    {
      name: 'name',
      type: 'string'
    }
  ]
});
