export interface BrowserStoreModel {
  connectedAddress: string;
  selectedAddress: string;
  browserConfig: BrowserConfig;
  setSelectedAddress: (address: string) => void;
  setConnectedAddress: (address: string) => void;
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
