import { RefObject } from 'react';
import { WebView } from '@metamask/react-native-webview';
import { Permissions, BasePermissions } from './permissions';
import { rpcRejectHandler } from '../utils';

export type TransactionParams = {
  from: string;
  to: string;
  value: string;
  data: string;
  gas?: string;
  gasPrice?: string;
  nonce?: string;
};

export interface BaseRPCRequest {
  response: RPCResponse;
  webViewRef: RefObject<WebView>;
  origin: string;
}

export type RPCResponse = {
  result?: unknown;
  error?: ReturnType<typeof rpcRejectHandler>;
};

export interface RPCRequestWithAccountCredentials extends BaseRPCRequest {
  privateKey: string;
  permissions: BasePermissions & { [Permissions.ACCOUNTS]: string[] };
}

export interface RPCRequestWithTransactionParams
  extends Pick<RPCRequestWithAccountCredentials, 'privateKey'> {
  params: [TransactionParams];
  response: RPCResponse;
}

export type SignMessageParams = {
  params: [string, string]; // [message, address]
  response: RPCResponse;
  privateKey: string;
};

export type SignTypedDataParams = {
  params: [string, Record<string, unknown>]; // [address, typedData]
  response: RPCResponse;
  privateKey: string;
};
