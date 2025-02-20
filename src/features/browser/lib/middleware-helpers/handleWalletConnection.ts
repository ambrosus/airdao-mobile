import { RefObject } from 'react';
import WebView from '@metamask/react-native-webview';
import { BottomSheetRef, ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import {
  requestUserApproval,
  rpcErrorHandler,
  rpcRejectHandler
} from '@features/browser/utils';
import { setConnectedAddressTo } from '@lib';
import {
  updateWindowObject,
  UPDATE_ETHEREUM_STATE_JS
} from '../injectable.provider';
import { permissionsHandler } from '../permissions-handler';

type ConnectionRequest = {
  response?: any;
  webViewRef: RefObject<WebView>;
  browserApproveRef: RefObject<BottomSheetRef>;
  browserWalletSelectorRef: RefObject<BottomSheetRef>;
  permissions?: unknown;
  uri: string;
};

export const handleWalletConnection = async ({
  webViewRef,
  browserApproveRef,
  browserWalletSelectorRef,
  uri,
  response
}: ConnectionRequest) => {
  const { setConnectedAddress } = useBrowserStore.getState();
  try {
    const address = await new Promise<string>((resolve, reject) => {
      browserWalletSelectorRef.current?.show({
        onWalletSelect: async (walletAddress: string) => {
          resolve(walletAddress); // Передаємо саме значення
          browserWalletSelectorRef.current?.dismiss();
          return walletAddress;
        },
        onReject: reject
      });
    });
    if (!address) {
      throw new Error('No account available');
    }
    const userConfirmation = await new Promise(async (resolve, reject) => {
      await requestUserApproval({
        browserApproveRef,
        selectedAddress: address,
        modalType: ModalActionTypes.PERMISSIONS,
        resolve: () => {
          resolve(true);
        },
        reject: () => reject(new Error('User rejected connection'))
      });
    });

    await userConfirmation;
    await setConnectedAddressTo(uri, address);
    setConnectedAddress(address);

    updateWindowObject(
      webViewRef,
      UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
    );

    return permissionsHandler.bind(address);
  } catch (error: unknown) {
    setConnectedAddress('');
    rpcErrorHandler('handleWalletConnection', error);
    response.error = rpcRejectHandler(4001, error);
  }
};
