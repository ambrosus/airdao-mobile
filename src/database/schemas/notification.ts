import { DatabaseTable } from '@appTypes';
import { tableSchema } from '@nozbe/watermelondb';

export const NotificationTable = tableSchema({
  name: DatabaseTable.Notifications,
  columns: [
    {
      name: 'type',
      type: 'string'
    },
    {
      name: 'body',
      type: 'string'
    },
    { name: 'is_read', type: 'boolean' },
    { name: 'created_at', type: 'number' }
  ]
});
