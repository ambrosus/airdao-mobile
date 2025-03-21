export enum AsyncStorageKey {
  browser = 'browser:'
}
export enum StorageKeys {
  walletPermissionsDetails = 'walletPermissionsDetails'
}

export interface Permissions {
  addresses: string[];
  icon: string;
}

export interface WalletsPermissions {
  [key: string]: Permissions;
}
