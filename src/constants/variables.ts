import { NotificationSettings } from '@appTypes/notification';

export const DefaultNotificationSettings: NotificationSettings = {
  priceAlerts: true,
  priceThreshold: {
    min: null,
    max: null
  },
  transactionAlerts: true,
  transactionThreshold: {
    min: null,
    max: null
  },
  pricePercentThreshold: 5,
  balancePercentChange: 5
};
