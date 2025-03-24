export enum AsyncStorageKey {
  browser = 'browser:'
}

export enum DeprecatedBrowserStorage {
  connectedAddressTo = 'connectedAddressTo'
}

export interface Permissions {
  addresses: string[];
  icon: string;
}

export interface WalletsPermissions {
  [key: string]: Permissions;
}

export interface SetConnectedAddressToModel {
  uri: string;
  addresses: string[];
  icon?: string;
}
