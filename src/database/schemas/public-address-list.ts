import { tableSchema } from '@nozbe/watermelondb';
import { DatabaseTable } from '@appTypes';

export const PublicAddressListsTable = tableSchema({
  name: DatabaseTable.PublicAddressLists,
  columns: [
    {
      name: 'name',
      type: 'string'
    }
  ]
});
