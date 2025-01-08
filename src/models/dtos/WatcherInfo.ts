import { NotificationDTO } from '@models';

interface WatcherInfoAddress {
  address: string;
  last_tx: unknown;
}

export interface WatcherInfoDTO {
  addresses: WatcherInfoAddress[];
  created_at: string;
  device_id: string;
  historical_notifications: NotificationDTO[];
  _id: string;
  push_token: string;
  threshold: number;
  token_price: number;
  updated_at: string;
}
