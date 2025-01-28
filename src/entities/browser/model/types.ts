export interface BrowserStoreModel {
  connectedAddress: string;
  setConnectedAddress: (address: string) => void;
}

export interface BrowserConfig {
  id: string;
  name: string;
  url: string;
  isAirDaoApp: string;
}
