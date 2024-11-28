import { NotificationType } from '@appTypes';
import { NotificationDTO } from './dtos';

export class Notification {
  _id: string;
  title: string;
  body: string;
  createdAt: Date;
  type: NotificationType;
  // isRead: boolean;

  private _determineType(title: string): NotificationType {
    console.log('->>>>', title);
    switch (title) {
      case 'Price Alert':
        return NotificationType.PriceAlert;
      case 'Price Alert Test':
        return NotificationType.TestnetPriceAlert;

      case 'AMB-TestNet Tx Alert':
      case 'AMB-DevNet Tx Alert':
        return NotificationType.TestnetTransactionAlert;
      case 'AMB-Net Tx Alert':
        return NotificationType.TransactionAlert;

      case 'Wallet Update':
        return NotificationType.WalletUpdate;
      default:
        return NotificationType.Default;
    }
  }

  constructor(details: NotificationDTO) {
    this._id = details._id;
    this.body = details.body;
    this.title = details.title;
    this.createdAt = new Date(details.timestamp);
    this.type = this._determineType(details.title);
    // this.isRead = details.isRead;
  }
}

export class NotificationWithPriceChange extends Notification {
  type: Exclude<NotificationType, NotificationType.TransactionAlert>;
  percentChange: number;
  amount: number;
  constructor(details: NotificationDTO) {
    super(details);
    this.title = 'Price Alert';
    this.type = NotificationType.PriceAlert;
    this.percentChange = 0;
    this.amount = 1000;
  }
}
