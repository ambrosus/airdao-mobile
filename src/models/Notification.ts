import { NotificationDTO } from './dtos';

export enum NotificationType {
  WalletUpdate = 'Wallet Update',
  TransactionAlert = 'Transaction Alert',
  PriceAlert = 'Price Alert'
}

export class Notification {
  _id: string;
  type: NotificationType;
  body: string;
  createdAt: Date;
  // isRead: boolean;

  constructor(details: NotificationDTO) {
    this._id = details._id;
    this.body = details.body;
    this.type = details.title as NotificationType;
    this.createdAt = new Date(details.timestamp);
    // this.isRead = details.isRead;
  }
}

export class NotificationWithPriceChange extends Notification {
  type: Exclude<NotificationType, 'TransactionAlert'>;
  percentChange: number;
  amount: number;
  constructor(details: NotificationDTO) {
    super(details);
    this.type = NotificationType.PriceAlert;
    this.percentChange = 0;
    this.amount = 1000;
  }
}
