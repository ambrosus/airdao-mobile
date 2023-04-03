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
  }
}

export class NotificationWithPriceChange extends Notification {
  type: Exclude<NotificationType, 'TransactionAlert'>;
  percentChange: number;
  amount: number;
  constructor(details: NotificationDTO) {
    // TODO
    super(details);
  }
}
