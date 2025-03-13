import { useBrowserStore } from '@entities/browser/model';
import { rpcErrorHandler } from '@features/browser/utils';
import { permissionsHandler } from '../permissions-handler';

export const walletGetPermissions = async ({ response }: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.get(connectedAddress);
  } catch (error: unknown) {
    rpcErrorHandler('walletGetPermissions', error);
  }
};
