export interface NotificationSettings {
  priceAlerts: boolean;
  priceThreshold: {
    min: number;
    max: number;
  };
  percentChangeAlerts: boolean;
  transactionAlerts: boolean;
  transactionThreshold: {
    min: number;
    max: number;
  };
}

export interface NotificationFilter {
  selectedDate: Date | null;
  priceAlerts: boolean;
  transactionAlerts: boolean;
  walletUpdates: boolean;
  marketUpdates: boolean;
}
