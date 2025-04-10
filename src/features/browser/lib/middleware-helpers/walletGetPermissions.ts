import { useBrowserStore } from '@entities/browser/model';
import {
  PermissionType,
  Permissions
} from '@features/browser/types/permissions';
import { rpcErrorHandler } from '@features/browser/utils';
import { permissionsHandler } from '../permissions-handler';

export interface WalletGetPermissionsArgs {
  response: {
    result: {
      parentCapability: Permissions;
      date: number;
      caveats: { type: PermissionType; value: string[] }[];
    }[];
  };
}

export const walletGetPermissions = async ({
  response
}: WalletGetPermissionsArgs) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.get(connectedAddress);
  } catch (error: unknown) {
    rpcErrorHandler('walletGetPermissions', error);
  }
};
