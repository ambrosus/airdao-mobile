import { AMB_CHAIN_ID_HEX } from '../constants';
import { rpcRejectHandler } from '../utils';

enum Permissions {
  ACCOUNTS = 'eth_accounts',
  CHAINS = 'endowment:permitted-chains'
}

enum PermissionType {
  RESTRICT_RETURNED_ACCOUNTS = 'restrictReturnedAccounts',
  RESTRICT_CHAINS = 'restrictChains'
}

const BASE_PERMISSIONS = [
  {
    parentCapability: Permissions.CHAINS,
    date: Date.now(),
    caveats: [
      {
        type: PermissionType.RESTRICT_CHAINS,
        value: [AMB_CHAIN_ID_HEX]
      }
    ]
  }
];

type BasePermissions = Pick<typeof Permissions, 'CHAINS'>;

export const INITIAL_ACCOUNTS_PERMISSIONS = {
  [Permissions.ACCOUNTS]: []
};

export class PermissionsHandler {
  get(address: string | undefined) {
    if (!address) {
      return BASE_PERMISSIONS;
    }

    return [
      {
        parentCapability: Permissions.ACCOUNTS,
        date: Date.now(),
        caveats: [
          {
            type: PermissionType.RESTRICT_RETURNED_ACCOUNTS,
            value: [address]
          }
        ]
      },
      ...BASE_PERMISSIONS
    ];
  }

  unbind(
    permissions: BasePermissions & { [Permissions.ACCOUNTS]: string[] },
    connectedAddress: string,
    setConnectedAddress: (address: string) => void,
    updateWindowObject: () => void
  ) {
    if (permissions[Permissions.ACCOUNTS]) {
      if (connectedAddress) {
        setConnectedAddress('');
        updateWindowObject();
      }
      return BASE_PERMISSIONS;
    }

    if (permissions.CHAINS) {
      return rpcRejectHandler(
        4200,
        new Error('Chain permissions cannot be revoked')
      );
    }

    return rpcRejectHandler(4200, new Error('Invalid permission type'));
  }

  bind(address: string) {
    return {
      accounts: [address],
      permissions: [
        {
          parentCapability: Permissions.ACCOUNTS,
          date: Date.now(),
          caveats: [
            {
              type: PermissionType.RESTRICT_RETURNED_ACCOUNTS,
              value: [address]
            }
          ]
        }
      ]
    };
  }
}

export const permissionsHandler = new PermissionsHandler();
