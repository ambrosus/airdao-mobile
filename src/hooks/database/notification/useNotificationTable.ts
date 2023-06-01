import { DatabaseTable } from '@appTypes';
import { NotificationModel } from '@database/models';
import { Collection } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';

export const useNotificationTable = (): Collection<NotificationModel> => {
  const database = useDatabase();
  return database.get(DatabaseTable.Notifications);
};
