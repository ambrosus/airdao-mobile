import { DatabaseTable } from '@appTypes';
import { Notification, NotificationType } from '@models';
import { Model } from '@nozbe/watermelondb';
import { text, date, readonly } from '@nozbe/watermelondb/decorators';

export class NotificationModel extends Model {
  static table = DatabaseTable.Notifications;

  // define fields
  @text('type') type?: string;
  @text('body') body?: string;
  @readonly @date('created_at') createdAt?: Date;

  hydrate(): Notification {
    return {
      _id: this.id,
      type: this.type as NotificationType,
      body: this.body || '',
      createdAt: this.createdAt ? new Date(this.createdAt) : new Date()
    };
  }
}
