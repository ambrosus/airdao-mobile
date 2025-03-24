export enum AsyncStorageKey {
  browser = 'browser:'
}

export enum DeprecatedBrowserStorage {
  connectedAddressTo = 'connectedAddressTo'
}

export interface StoragePermissions {
  addresses: string[];
  icon: string;
}

export interface WalletsPermissions {
  [key: string]: StoragePermissions;
}

export interface SetConnectedAddressToModel {
  uri: string;
  addresses: string[];
  icon?: string;
}
