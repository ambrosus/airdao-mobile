import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_HEX } from '../constants';
import { Permissions, PermissionType, BasePermissions } from '../types';
import { rpcRejectHandler } from '../utils';

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
    updateWindowObject: () => void
  ) {
    const { connectedAddress, setConnectedAddress } =
      useBrowserStore.getState();

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
