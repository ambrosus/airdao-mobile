import { RefObject } from 'react';
import { WebView } from '@metamask/react-native-webview';
import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import { rpcErrorHandler } from '@features/browser/utils';
import { setConnectedAddressTo } from '@lib';
import {
  updateWindowObject,
  UPDATE_ETHEREUM_STATE_JS
} from '../injectable.provider';
import { permissionsHandler } from '../permissions-handler';

interface WalletRevokePermissionsProps {
  permissions: any;
  response: any;
  webViewRef: RefObject<WebView>;
  uri: string;
}

export const walletRevokePermissions = async ({
  permissions,
  response,
  webViewRef,
  uri
}: WalletRevokePermissionsProps) => {
  const { setConnectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.unbind(permissions, () =>
      updateWindowObject(
        webViewRef,
        UPDATE_ETHEREUM_STATE_JS('', AMB_CHAIN_ID_HEX)
      )
    );
    await setConnectedAddressTo(uri, '');
    setConnectedAddress('');
  } catch (error: unknown) {
    rpcErrorHandler('walletRevokePermissions', error);
  }
};
