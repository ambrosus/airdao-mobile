import { NotificationSettings } from '@appTypes/notification';

export const DefaultNotificationSettings: NotificationSettings = {
  priceAlerts: false,
  priceThreshold: {
    min: null,
    max: null
  },
  transactionAlerts: false,
  transactionThreshold: {
    min: null,
    max: null
  },
  pricePercentThreshold: 5,
  balancePercentChange: 5
};

export const CRYPTO_ADDRESS_MAX_LENGTH = 62;

export const TRANSACTION_HASH_MAX_LENGTH = 66;

export const CMC_API_KEY = '';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
