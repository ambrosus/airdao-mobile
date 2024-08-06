import { NotificationDTO } from './NotificationDTO';

interface WatcherInfoAddress {
  address: string;
  last_tx: unknown;
}

export interface WatcherInfoDTO {
  addresses: WatcherInfoAddress[];
  createdAt: string;
  historicalNotifications: NotificationDTO[];
  id: string;
  pushToken: string;
  threshold: number;
  tokenPrice: number;
  updatedAt: string;
}
