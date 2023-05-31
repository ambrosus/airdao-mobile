import { appSchema } from '@nozbe/watermelondb';
import { NotificationTable } from './notification';

export const schema = appSchema({
  version: 1,
  tables: [NotificationTable]
});
