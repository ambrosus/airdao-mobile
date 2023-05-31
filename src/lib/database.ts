import { DatabaseTable } from '@appTypes';
import { database } from '@database';
import { NotificationModel } from '@database/models';
import { NotificationType } from '@models';
import { Collection, Q } from '@nozbe/watermelondb';

export class DatabaseService {
  private notifications: Collection<NotificationModel>;

  constructor() {
    this.notifications = database.collections.get(DatabaseTable.Notifications);
  }

  async saveNotification(type: NotificationType, body: string) {
    await database.write(async () => {
      await this.notifications.create((notification: NotificationModel) => {
        notification.type = type;
        notification.body = body;
      });
    });
  }

  observeNotifications = (...query: Q.Clause[]) =>
    this.notifications.query(query).observe();
}
