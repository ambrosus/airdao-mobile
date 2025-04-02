import { IsNullableAccount } from '@entities/wallet/model/types';
import { ProductSections } from '@features/products/utils';

export interface BrowserStoreModel {
  connectedAddress: string;
  connectedAccount: IsNullableAccount;
  productTitle: string;
  browserConfig: BrowserConfig;
  productIcon: string;
  getProductIcon: () => string;
  setProductIcon: (payload: string) => void;
  setProductTitle: (payload: string) => void;
  setConnectedAccount: (payload: IsNullableAccount) => void;
  setConnectedAddress: (payload: string) => void;
  setBrowserConfig: () => Promise<void>;
}

export interface BrowserItemModel {
  id: number;
  section: ProductSections;
  icon: string;
  platforms: string[];
  description: { [key: string]: string };
  name: { [key: string]: string };
  background: [string, string];
  color: string;
  uri: string;
  isAirDaoApp: string;
}

export interface BrowserConfig {
  products: BrowserItemModel[];
}
