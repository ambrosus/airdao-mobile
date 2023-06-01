import { DatabaseTable } from '@appTypes';
import { database } from '@database';
import { NotificationModel } from '@database/models';
import { Notification, NotificationType } from '@models';
import { Collection, Q } from '@nozbe/watermelondb';

export class DatabaseService {
  private notifications: Collection<NotificationModel>;

  constructor() {
    this.notifications = database.collections.get(DatabaseTable.Notifications);
  }

  async saveNotification(id: string, type: NotificationType, body: string) {
    await database.write(async () => {
      await this.notifications.create((notification: NotificationModel) => {
        notification.type = type;
        notification.body = body;
        if (id) notification._raw.id = id;
      });
    });
  }

  async markAsRead(args: Notification | Notification[]) {
    let ids: string[] = [];
    if (Array.isArray(args)) {
      ids = args.map((nt) => nt._id);
    } else {
      ids = [args._id];
    }
    await database.write(async () => {
      (
        await this.notifications.query(Q.where('id', Q.oneOf(ids))).fetch()
      ).forEach(async (notification) => {
        await notification.markAsRead();
      });
    });
  }
}
