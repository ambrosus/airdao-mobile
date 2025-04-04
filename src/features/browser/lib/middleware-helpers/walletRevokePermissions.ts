import Config from '@constants/config';
import { useBrowserStore } from '@entities/browser/model';
import { WalletRevokePermissionsProps } from '@features/browser/types';
import { rpcErrorHandler } from '@features/browser/utils';
import { removeConnectedAddressTo } from '@lib';
import {
  updateWindowObject,
  UPDATE_ETHEREUM_STATE_JS
} from '../injectable.provider';
import { permissionsHandler } from '../permissions-handler';

export const walletRevokePermissions = async ({
  permissions,
  response,
  webViewRef,
  uri
}: WalletRevokePermissionsProps) => {
  const { setConnectedAddress, connectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.unbind(permissions, () =>
      updateWindowObject(
        webViewRef,
        UPDATE_ETHEREUM_STATE_JS('', Config.CHAIN_ID_HEX)
      )
    );
    removeConnectedAddressTo(uri, connectedAddress);
    setConnectedAddress('');
  } catch (error: unknown) {
    rpcErrorHandler('walletRevokePermissions', error);
  }
};
