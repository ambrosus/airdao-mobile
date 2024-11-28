export enum NotificationType {
  TransactionAlert = 'transaction-alert',
  PriceAlert = 'price-alert',
  WalletUpdate = 'wallet-update',
  TestnetTransactionAlert = 'testnet-transaction-alert',
  TestnetPriceAlert = 'testnet-price-alert',
  Default = ''
}

export interface NotificationSettings {
  priceAlerts: boolean;
  priceThreshold: {
    min: number | null;
    max: number | null;
  };
  pricePercentThreshold: number;
  transactionAlerts: boolean;
  transactionThreshold: {
    min: number | null;
    max: number | null;
  };
  balancePercentChange: number;
}

export interface NotificationFilter {
  selectedDate: Date | null;
  priceAlerts: boolean;
  transactionAlerts: boolean;
  walletUpdates: boolean;
  marketUpdates: boolean;
}
