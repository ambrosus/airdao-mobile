export enum AsyncStorageKey {
  connectedAddressTo = 'connectedAddressTo'
}
export enum StorageKeys {
  walletPermissionsDetails = 'walletPermissionsDetails'
}

export interface ConnectionDetails {
  title: string;
  productIcon: string;
  uri: string;
  timestamp: number;
}

export interface WalletConnectionDetails {
  address: string;
  data: ConnectionDetails[];
}
export interface GroupedPermissions {
  uri: string;
  data: {
    title: string;
    productIcon: string;
    address: string[];
    timestamp: number;
  };
}
