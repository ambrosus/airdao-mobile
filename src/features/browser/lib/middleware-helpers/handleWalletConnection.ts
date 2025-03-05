/* eslint-disable no-console */
// tslint:disable:no-console
import { ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import { ConnectionRequest } from '@features/browser/types';
import {
  requestUserApproval,
  rpcErrorHandler,
  rpcRejectHandler
} from '@features/browser/utils';
import { setConnectedAddressTo } from '@lib';
import { delay } from '@utils';
import {
  updateWindowObject,
  UPDATE_ETHEREUM_STATE_JS
} from '../injectable.provider';
import { permissionsHandler } from '../permissions-handler';

export const handleWalletConnection = async ({
  webViewRef,
  response,
  browserApproveRef,
  browserWalletSelectorRef,
  uri
}: ConnectionRequest) => {
  const { setConnectedAddress } = useBrowserStore.getState();
  try {
    const address = await new Promise<string>(async (resolve, reject) => {
      await delay(400);
      browserWalletSelectorRef.current?.show({
        onWalletSelect: async (walletAddress: string) => {
          resolve(walletAddress);
          browserWalletSelectorRef.current?.dismiss();
          return walletAddress;
        },
        onReject: () => reject(new Error('User rejected connection'))
      });
    });

    const userConfirmation = await new Promise(async (resolve, reject) => {
      await requestUserApproval({
        browserApproveRef,
        selectedAddress: address,
        modalType: ModalActionTypes.PERMISSIONS,
        resolve: () => {
          resolve(true);
        },
        reject: () => reject(new Error('User rejected the request.'))
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
    console.log(2, 'TYT');
    response.error = rpcRejectHandler(4001, error);
    setConnectedAddress('');
    rpcErrorHandler('handleWalletConnection', error);
  }
};
