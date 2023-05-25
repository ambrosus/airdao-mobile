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

  constructor(details: NotificationDTO) {
    // TODO
    this._id = details._id;
    this.type = NotificationType.PriceAlert;
    this.body =
      'This is a demo notification body. TODO: Edit Notification constructor';
    this.type = NotificationType.PriceAlert;
    this.createdAt = new Date();
  }
}

export class NotificationWithPriceChange extends Notification {
  type: Exclude<NotificationType, 'TransactionAlert'>;
  percentChange: number;
  amount: number;
  constructor(details: NotificationDTO) {
    // TODO
    super(details);
    this.type = NotificationType.PriceAlert;
    this.percentChange = 0;
    this.amount = 1000;
  }
}
