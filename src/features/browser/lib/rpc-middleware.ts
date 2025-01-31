/* eslint-disable no-console */
// tslint:disable:no-console
import { RefObject } from 'react';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { BottomSheetRef } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { AMB_CHAIN_ID_DEC } from '@features/browser/constants';
import {
  ethRequestAccounts,
  ethSendTransaction,
  ethSignTransaction,
  ethSignTypesData,
  personalSing,
  walletGetPermissions,
  walletRequestPermissions,
  walletRevokePermissions
} from '@features/browser/lib/middleware.helpers';
import { rpcErrorHandler } from '@features/browser/utils/rpc-error-handler';
import { rpcMethods } from './rpc-methods';

interface JsonRpcRequest {
  id: number;
  jsonrpc: string;
  method: string;
  params: any[];
}

interface JsonRpcResponse {
  id: number;
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

interface HandleWebViewMessageModel {
  event: WebViewMessageEvent;
  webViewRef: RefObject<WebView>;
  privateKey: string;
  uri: string;
  browserModalRef: RefObject<BottomSheetRef>;
}

export async function handleWebViewMessage({
  event,
  webViewRef,
  privateKey,
  uri,
  browserModalRef
}: HandleWebViewMessageModel) {
  const { connectedAddress } = useBrowserStore.getState();
  const requestsInProgress = new Set();

  const { handleChainIdRequest, handleGetBalance, sendResponse } = rpcMethods;

  const logger = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', {
        method: data.method,
        params: data.params,
        id: data.id
      });
    } catch (e) {
      console.log('Raw WebView message:', event.nativeEvent.data);
    }
  };

  try {
    logger(event);
    const request: JsonRpcRequest = JSON.parse(event.nativeEvent.data);
    const { id, method, params } = request;
    console.log('method->>', method);

    // Skip duplicate requests
    if (requestsInProgress.has(id)) {
      return;
    }
    requestsInProgress.add(id);

    // console.log('Incoming request:', { id, method, params });

    const response: JsonRpcResponse = {
      id,
      jsonrpc: '2.0',
      // @ts-ignore
      method
    };

    try {
      switch (method) {
        case 'net_version':
          response.result = AMB_CHAIN_ID_DEC;
          break;

        case 'eth_requestAccounts':
          await ethRequestAccounts({ response, privateKey, webViewRef });
          break;

        case 'eth_accounts': {
          response.result = connectedAddress ? [connectedAddress] : [];
          break;
        }

        case 'wallet_requestPermissions': {
          const permissions = params[0];
          browserModalRef.current?.show({
            title: 'Do You want to give permissions to',
            subTitle: `to:  ${uri}`,
            onApprove: async () =>
              await walletRequestPermissions({
                permissions,
                response,
                privateKey,
                webViewRef
              })
          });
          break;
        }

        case 'wallet_revokePermissions': {
          const permissions = params[0];
          await walletRevokePermissions({ permissions, response, webViewRef });
          break;
        }

        case 'wallet_getPermissions': {
          await walletGetPermissions({ response });
          break;
        }

        case 'eth_chainId':
          response.result = await handleChainIdRequest();
          break;

        case 'eth_sendTransaction': {
          await ethSendTransaction({
            params,
            response,
            privateKey
          });
          break;
        }

        case 'eth_signTransaction': {
          await ethSignTransaction({
            params,
            response,
            privateKey
          });
          break;
        }

        case 'personal_sign':
        case 'eth_sign':
          await personalSing({ params, response, privateKey });
          break;

        case 'eth_getBalance':
          response.result = await handleGetBalance(params[0], params[1]);
          break;

        case 'eth_signTypedData_v4':
        case 'eth_signTypedData':
          await ethSignTypesData({
            params,
            response,
            privateKey
          });
          break;
        default:
          response.error = {
            code: 4200,
            message: `Method ${method} not supported`
          };
      }
      // @ts-ignore
      sendResponse(response, webViewRef);
    } finally {
      requestsInProgress.delete(id);
    }
  } catch (error) {
    rpcErrorHandler('handleWebViewMessage', error);
    sendResponse(
      {
        id: -1,
        jsonrpc: '2.0',
        error: {
          code: 4001,
          message: (error as Error).message || 'Unknown error occurred'
        }
      },
      webViewRef
    );
  }
}
