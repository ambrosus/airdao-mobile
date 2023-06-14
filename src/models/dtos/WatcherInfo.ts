import { NotificationDTO } from './NotificationDTO';

interface WatcherInfoAddress {
  address: string;
  last_tx: unknown;
}

export interface WatcherInfoDTO {
  addresses: WatcherInfoAddress[];
  created_at: string;
  history_notifications: NotificationDTO[];
  id: string;
  push_token: string;
  threshold: number;
  token_price: number;
  updated_at: string;
}
