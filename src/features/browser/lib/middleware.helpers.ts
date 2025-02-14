import { RefObject } from 'react';
import WebView from '@metamask/react-native-webview';
import { BottomSheetRef, ModalActionTypes } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import {
  AMB_CHAIN_ID_HEX,
  INITIAL_ACCOUNTS_PERMISSIONS
} from '@features/browser/constants';
import {
  rpcErrorHandler,
  requestUserApproval,
  rpcRejectHandler
} from '@features/browser/utils';
import {
  UPDATE_ETHEREUM_STATE_JS,
  updateWindowObject
} from './injectable.provider';
import { permissionsHandler } from './permissions-handler';
import { rpcMethods } from './rpc-methods';
import {
  RPCRequestWithTransactionParams,
  SignMessageParams,
  SignTypedDataParams
} from '../types';

const {
  getCurrentAddress,
  handleSendTransaction,
  handleSignTransaction,
  signMessage,
  _signTypedData
} = rpcMethods;

type ConnectionRequest = {
  privateKey: string;
  webViewRef: RefObject<WebView>;
  browserApproveRef: RefObject<BottomSheetRef>;
  origin: string;
  permissions?: unknown;
};

type WalletConnectionResult = {
  accounts: string[];
};

export const handleWalletConnection = async ({
  privateKey,
  webViewRef,
  origin,
  browserApproveRef
}: ConnectionRequest) => {
  const { setConnectedAddress } = useBrowserStore.getState();
  try {
    const address = await getCurrentAddress(privateKey);
    if (!address) {
      throw new Error('No account available');
    }

    const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    await new Promise((resolve, reject) => {
      requestUserApproval({
        browserApproveRef,
        modalType: ModalActionTypes.permissions,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected connection'))

        //   header: 'Connect to Website',
        //   message:
        //     `${origin} would like to connect to your wallet:\n\n` +
        //     `Account: ${displayAddress}\n\n` +
        //     `Permissions requested:\n` +
        //     `• View and connect to your wallet\n` +
        //     `• Request transaction approvals\n` +
        //     `• Request message signatures`,
        //   resolve: () => resolve(true),
        //   reject: () => reject(new Error('User rejected connection'))
        // });
      });
      setConnectedAddress(address);
    });

    updateWindowObject(
      webViewRef,
      UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
    );

    return permissionsHandler.bind(address);
  } catch (error: unknown) {
    setConnectedAddress('');
    rpcErrorHandler('handleWalletConnection', error);
    throw error;
  }
};

export const ethRequestAccounts = ({
  ...params
}: ConnectionRequest): Promise<string[]> =>
  handleWalletConnection({
    ...params,
    permissions: INITIAL_ACCOUNTS_PERMISSIONS
  }).then((result: WalletConnectionResult) => result.accounts);

export const walletRequestPermissions = async ({
  permissions,
  response,
  privateKey,
  webViewRef,
  origin,
  browserApproveRef
}: ConnectionRequest & { response: any }) => {
  try {
    const { permissions: _permissions } = await handleWalletConnection({
      browserApproveRef,
      privateKey,
      webViewRef,
      origin,
      permissions: permissions || INITIAL_ACCOUNTS_PERMISSIONS
    });
    response.result = _permissions;
  } catch (error: unknown) {
    rpcErrorHandler('walletRequestPermissions', error);
    throw error;
  }
};

export const ethAccounts = async ({ privateKey }: { privateKey: string }) => {
  const { connectedAddress } = useBrowserStore.getState();
  if (!connectedAddress) return [];

  const address = await getCurrentAddress(privateKey);
  return address ? [address] : [];
};

export const walletRevokePermissions = async ({
  permissions,
  response,
  webViewRef
}: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.unbind(permissions, () =>
      updateWindowObject(
        webViewRef,
        UPDATE_ETHEREUM_STATE_JS(connectedAddress, AMB_CHAIN_ID_HEX)
      )
    );
  } catch (error: unknown) {
    rpcErrorHandler('walletRevokePermissions', error);
  }
};

export const walletGetPermissions = async ({ response }: any) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    response.result = permissionsHandler.get(connectedAddress);
  } catch (error: unknown) {
    rpcErrorHandler('walletGetPermissions', error);
  }
};

export const ethSendTransaction = async ({
  params: [txParams],
  response,
  privateKey
}: RPCRequestWithTransactionParams) => {
  try {
    await new Promise<void>((resolve, reject) => {
      requestUserApproval({
        header: 'Confirm Transaction',
        message:
          `Do you want to send this transaction? From: ${txParams.from}\n` +
          `To: ${txParams.to}\n` +
          `Value: ${txParams.value || '0'} Wei\n` +
          `Data: ${txParams.data || 'None'}`,
        resolve: () => resolve(),
        reject: () => reject(new Error('User rejected transaction'))
      });
    });

    response.result = await handleSendTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};

export const ethSignTransaction = async ({
  params,
  response,
  privateKey
}: any) => {
  try {
    const txParams = params[0];

    await new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Sign Transaction',
        message:
          `Do you want to send this transaction? From: ${txParams.from}\n` +
          `To: ${txParams.to}\n` +
          `Value: ${txParams.value || '0'} Wei\n` +
          `Data: ${txParams.data || 'None'}`,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    response.result = await handleSignTransaction(txParams, privateKey);
  } catch (error) {
    rpcErrorHandler('eth_sendTransaction', error);
    throw error;
  }
};

export const personalSing = async ({
  params,
  response,
  privateKey
}: SignMessageParams) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    const [message, address] = params;

    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      throw new Error('Address mismatch');
    }

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Sign Message',
        message: 'Do you want to sign this message?',
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });

    await userConfirmation;

    response.result = await signMessage(message, privateKey);
  } catch (error) {
    response.error = rpcRejectHandler(4001, error);
  }
};

export const ethSignTypesData = async ({
  params,
  response,
  privateKey
}: SignTypedDataParams) => {
  const { connectedAddress } = useBrowserStore.getState();
  try {
    const [address, typedData] = params;

    if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
      throw new Error('Address mismatch');
    }

    const data =
      typeof typedData === 'string' ? JSON.parse(typedData) : typedData;

    const userConfirmation = new Promise((resolve, reject) => {
      requestUserApproval({
        header: 'Sign Typed Data',
        message: `Do you want to sign this data?\n\nFrom: ${address}\n\nData: ${JSON.stringify(
          data,
          null,
          2
        )}`,
        resolve: () => resolve(true),
        reject: () => reject(new Error('User rejected signing'))
      });
    });
    await userConfirmation;

    response.result = await _signTypedData(data, privateKey);
  } catch (error) {
    console.error('Failed to sign typed data:', error);
    throw error;
  }
};
