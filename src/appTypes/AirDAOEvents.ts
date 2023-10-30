import { NotificationType } from './notification';

export enum AirDAOEventType {
  CollectionItemOpened = 'collection-item-opened',
  NotificationReceived = 'notification-received',
  WalletItemOpened = 'wallet-item-opened',
  FundsSentFromApp = 'user-sent-funds-from-app'
}

export type AirDAOWalletItemOpenEventPayload = string;

export type AirDAONotificationReceiveEventPayload = {
  type: NotificationType;
  to: string;
  from: string;
};

export type AirDAOFundsSentFromAppEventPayload = {
  from: string;
  to: string;
};

export type AirDAOEventPayload =
  | AirDAOWalletItemOpenEventPayload
  | AirDAONotificationReceiveEventPayload
  | AirDAOFundsSentFromAppEventPayload;
