import { IsNullableAccount } from '@entities/wallet/model/types';

export interface BrowserStoreModel {
  connectedAddress: string;
  connectedAccount: IsNullableAccount;
  browserConfig: BrowserConfig;
  setConnectedAccount: (payload: IsNullableAccount) => void;
  setConnectedAddress: (payload: string) => void;
  setBrowserConfig: () => Promise<void>;
}

export interface BrowserItemModel {
  id: number;
  icon: string;
  description: { [key: string]: string };
  name: { [key: string]: string };
  background: string[];
  color: string;
  uri: string;
  isAirDaoApp: string;
}

export interface BrowserConfig {
  products: BrowserItemModel[];
}
