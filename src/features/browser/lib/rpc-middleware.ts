/* eslint-disable no-console */
// tslint:disable:no-console
import { WebViewMessageEvent } from '@metamask/react-native-webview';
import Config from '@constants/config';
import { useBrowserStore } from '@entities/browser/model';
import { INITIAL_ACCOUNTS_PERMISSIONS } from '@features/browser/constants';
import { ethEstimateGas } from '@features/browser/lib/middleware-helpers/ethEstimateGas';
import { rpcErrorHandler } from '@features/browser/utils/rpc-error-handler';
import {
  ethCall,
  ethSendTransaction,
  ethSignTransaction,
  ethSignTypesData,
  ethGetBlockNumber,
  ethGetTransactionByHash,
  ethGetTransactionReceipt,
  handleWalletConnection,
  personalSign,
  walletGetPermissions,
  walletRevokePermissions
} from 'src/features/browser/lib/middleware-helpers';
import { rpcMethods } from './rpc-methods';
import {
  HandleWebViewMessageModel,
  JsonRpcRequest,
  JsonRpcResponse,
  RPCMethods,
  TransactionParams,
  WalletConnectionResult
} from '../types';

export async function handleWebViewMessage({
  uri,
  event,
  webViewRef,
  privateKey,
  browserApproveRef,
  browserWalletSelectorRef
}: HandleWebViewMessageModel) {
  const { connectedAddress, setProductTitle, setProductIcon } =
    useBrowserStore.getState();
  const requestsInProgress = new Set();

  const { handleChainIdRequest, handleGetBalance, sendResponse } = rpcMethods;

  const logger = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.method !== RPCMethods.EthCall) {
        console.log('WebView message:', {
          method: data.method,
          params: data.params,
          id: data.id
        });
      }
    } catch (e) {
      console.log('Raw WebView message:', event.nativeEvent.data);
    }
  };

  try {
    logger(event);
    const request: JsonRpcRequest = JSON.parse(event.nativeEvent.data);
    const { id, method, params } = request;
    if (method !== RPCMethods.EthCall) {
      console.log('method->>', method);
    }

    // Skip duplicate requests
    if (requestsInProgress.has(id)) {
      return;
    }
    requestsInProgress.add(id);

    const response: JsonRpcResponse = {
      id,
      jsonrpc: '2.0',
      // @ts-ignore
      method
    };

    try {
      switch (method) {
        // net_version
        case RPCMethods.NetVersion:
          response.result = Config.CHAIN_ID;
          break;

        // eth_requestAccounts
        case RPCMethods.EthRequestAccounts: {
          response.result = await handleWalletConnection({
            uri,
            response,
            browserWalletSelectorRef,
            webViewRef,
            browserApproveRef,
            permissions: INITIAL_ACCOUNTS_PERMISSIONS
          }).then((result: WalletConnectionResult) => result?.accounts);
          break;
        }

        // wallet_requestPermissions
        case RPCMethods.WalletRequestPermissions: {
          const permissions = params[0];
          await handleWalletConnection({
            uri,
            response,
            browserApproveRef,
            browserWalletSelectorRef,
            webViewRef,
            permissions: permissions || INITIAL_ACCOUNTS_PERMISSIONS
          }).then((result) => (response.result = result?.permissions));
          break;
        }

        // personal_sign
        case RPCMethods.PersonalSign:
        // eth_sign
        case RPCMethods.EthSign:
          await personalSign({
            params: params as [string, string],
            response,
            privateKey,
            browserApproveRef
          });
          break;

        case RPCMethods.EthGetTransactionByHash:
          response.result = await ethGetTransactionByHash(params[0]);
          break;

        case RPCMethods.EthBlockNumber:
        case RPCMethods.EthGetBlockNumber:
          response.result = await ethGetBlockNumber();
          break;

        case RPCMethods.EthGetTransactionReceipt:
          response.result = await ethGetTransactionReceipt(params[0]);
          break;

        // eth_call
        case RPCMethods.EthCall: {
          await ethCall({ data: params[0], response });
          break;
        }

        // eth_estimateGas
        case RPCMethods.EthEstimateGas: {
          await ethEstimateGas({ data: params[0], response });
          break;
        }
        // eth_sendTransaction
        case RPCMethods.WalletSendTransaction:
        case RPCMethods.EthSendTransaction:
          await ethSendTransaction({
            params: params as [TransactionParams],
            response,
            privateKey,
            browserApproveRef
          });
          break;

        // get_title
        case RPCMethods.GetTitle:
          if (params[0]) {
            setProductTitle(params[0]);
          }
          break;
        case RPCMethods.GetIcon:
          if (params[0]) {
            setProductIcon(params[0]);
          }

        // eth_accounts
        case RPCMethods.EthAccounts:
          response.result = connectedAddress ? [connectedAddress] : [];
          break;

        // wallet_revokePermissions
        case RPCMethods.WalletRevokePermissions:
          await walletRevokePermissions({
            permissions: params[0],
            response,
            webViewRef,
            uri
          });
          break;

        // eth_signTypedData_v4
        case RPCMethods.EthSignTypedDataV4:
        // eth_signTypedData
        case RPCMethods.EthSignTypedData:
          await ethSignTypesData({
            params: params as [string, Record<string, unknown>],
            response,
            privateKey,
            browserApproveRef
          });
          break;

        // eth_chainId
        case RPCMethods.EthChainId:
          response.result = await handleChainIdRequest();
          break;

        // wallet_getPermissions
        case RPCMethods.WalletGetPermissions:
          await walletGetPermissions({ response: response as any });
          break;

        // eth_signTransaction
        case RPCMethods.EthSignTransaction:
          await ethSignTransaction({
            params,
            response,
            privateKey,
            browserApproveRef
          });
          break;

        // eth_getBalance
        case RPCMethods.EthGetBalance:
          response.result = await handleGetBalance(params[0], params[1]);
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
