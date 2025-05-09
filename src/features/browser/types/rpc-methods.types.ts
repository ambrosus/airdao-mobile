import { RefObject } from 'react';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { BigNumber } from 'ethers';
import { BottomSheetRef } from '@components/composite';
import { Permissions, BasePermissions, PermissionType } from './permissions';
import { rpcRejectHandler } from '../utils';

export enum RPCMethods {
  // functional methods
  GetTitle = 'get_title',
  GetIcon = 'get_icon',

  // rpc_methods
  NetVersion = 'net_version',
  EthRequestAccounts = 'eth_requestAccounts',
  WalletRequestPermissions = 'wallet_requestPermissions',
  PersonalSign = 'personal_sign',
  EthSign = 'eth_sign',
  EthAccounts = 'eth_accounts',
  WalletRevokePermissions = 'wallet_revokePermissions',
  WalletGetPermissions = 'wallet_getPermissions',
  WalletSendTransaction = 'wallet_sendTransaction',
  EthChainId = 'eth_chainId',
  EthSendTransaction = 'eth_sendTransaction',
  EthSignTransaction = 'eth_signTransaction',
  EthGetBalance = 'eth_getBalance',
  EthSignTypedDataV4 = 'eth_signTypedData_v4',
  EthSignTypedData = 'eth_signTypedData',
  EthCall = 'eth_call',
  EthEstimateGas = 'eth_estimateGas',
  EthGetTransactionByHash = 'eth_getTransactionByHash',
  EthGetBlockNumber = 'eth_getBlockNumber',
  EthBlockNumber = 'eth_blockNumber',
  EthGetTransactionReceipt = 'eth_getTransactionReceipt',

  // added methods
  WalletWatchAsset = 'wallet_watchAsset',
  EthGetEncryptionPublicKey = 'eth_getEncryptionPublicKey',
  EthDecrypt = 'eth_decrypt',
  EthFeeHistory = 'eth_feeHistory',
  EthGasPrice = 'eth_gasPrice',
  EthGetBlockByHash = 'eth_getBlockByHash',
  EthGetBlockByNumber = 'eth_getBlockByNumber',
  EthGetBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
  EthGetBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
  EthGetCode = 'eth_getCode',
  EthGetLogs = 'eth_getLogs',
  EthGetStorageAt = 'eth_getStorageAt',
  EthGetTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
  EthGetTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
  EthGetTransactionCount = 'eth_getTransactionCount',
  EthSendRawTransaction = 'eth_sendRawTransaction',
  EthSyncing = 'eth_syncing'
}

export type TransactionParams = {
  from: string;
  to: string;
  value: string;
  data: string;
  gas?: string;
  gasLimit?: BigNumber | string;
  gasPrice?: BigNumber;
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
  browserApproveRef: RefObject<BottomSheetRef>;
}

export type SignMessageParams = {
  params: [string, string]; // [message, address]
  response: RPCResponse;
  privateKey: string;
  browserApproveRef: RefObject<BottomSheetRef>;
};

export type SignTypedDataParams = {
  params: [string, Record<string, unknown>]; // [address, typedData]
  response: RPCResponse;
  privateKey: string;
  browserApproveRef: RefObject<BottomSheetRef>;
};

export type WalletConnectionResult =
  | {
      accounts: string[];
      permissions: {
        parentCapability: Permissions;
        date: number;
        caveats: { type: PermissionType; value: string[] }[];
      }[];
    }
  | undefined
  | any;

export interface JsonRpcRequest {
  id: number;
  jsonrpc: string;
  method: RPCMethods;
  params: any[];
}

export interface JsonRpcResponse {
  id: number;
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface HandleWebViewMessageModel {
  uri: string;
  event: WebViewMessageEvent;
  webViewRef: RefObject<WebView>;
  privateKey: string;
  browserApproveRef: RefObject<BottomSheetRef>;
  browserWalletSelectorRef: RefObject<BottomSheetRef>;
}

export interface EthCallProps {
  data: {
    to: string;
    data: string;
  };
  response: any;
}

export interface EthEstimateGas {
  data: string;
  from: string;
  to: string;
  value: string;
}

export interface EthEstimateGasProps {
  response: any;
  data: EthEstimateGas;
}

export interface EthSignTransactionParams {
  params: any;
  response: any;
  privateKey: string;
  browserApproveRef: RefObject<BottomSheetRef>;
}

export type ConnectionRequest = {
  webViewRef: RefObject<WebView>;
  browserApproveRef: RefObject<BottomSheetRef>;
  browserWalletSelectorRef: RefObject<BottomSheetRef>;
  permissions?: unknown;
  response: any;
  uri: string;
};

export interface WalletRevokePermissionsProps {
  permissions: any;
  response: any;
  webViewRef: RefObject<WebView>;
  uri: string;
}

export interface EthEncryptionPublicKeyProps {
  privateKey: string; // hex string without '0x' prefix
  response: JsonRpcResponse;
  browserApproveRef: RefObject<BottomSheetRef>;
  address: string;
}

export interface EthDecryptInputProps {
  response: JsonRpcResponse;
  browserApproveRef: RefObject<BottomSheetRef>;
  privateKey: string;
  params: any[];
}

export interface EthGetMethodsProps {
  params: any[];
  response: JsonRpcResponse;
}
