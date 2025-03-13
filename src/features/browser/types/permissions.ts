export enum Permissions {
  ACCOUNTS = 'eth_accounts',
  CHAINS = 'endowment:permitted-chains'
}

export enum PermissionType {
  RESTRICT_RETURNED_ACCOUNTS = 'restrictReturnedAccounts',
  RESTRICT_CHAINS = 'restrictChains'
}

export type BasePermissions = Pick<typeof Permissions, 'CHAINS'>;
