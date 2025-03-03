/* eslint-disable no-console */
// tslint:disable:no-console
import { RefObject } from 'react';
import { WebView } from '@metamask/react-native-webview';
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types';
import { ethers } from 'ethers';
import Config from '@constants/config';
import { TransactionParams } from '@features/browser/types';
import { AMB_CHAIN_ID_DEC } from '../constants';
import { rpcErrorHandler } from '../utils';

const extractWallet = async (privateKey: string) => {
  return new ethers.Wallet(
    privateKey,
    new ethers.providers.JsonRpcProvider(Config.NETWORK_URL, Config.CHAIN_ID)
  );
};

const getCurrentAddress = async (privateKey: string) => {
  try {
    const wallet = await extractWallet(privateKey);
    return await wallet.getAddress();
  } catch (error) {
    rpcErrorHandler('getCurrentAddress', error);
    return null;
  }
};

const handleChainIdRequest = async () => {
  return `0x${Number(AMB_CHAIN_ID_DEC).toString(16)}`;
};

const handleSendTransaction = async (
  txParams: TransactionParams,
  privateKey: string
) => {
  const wallet = await extractWallet(privateKey);
  const { gas, ...rest } = txParams;
  const modifiedTxParams = {
    ...rest,
    gasLimit: gas
  };
  const tx = await wallet.sendTransaction(modifiedTxParams);
  return tx.hash;
};

const handleSignTransaction = async (txParams: any, privateKey: string) => {
  const wallet = await extractWallet(privateKey);
  return await wallet.signTransaction(txParams);
};

const handleGetBalance = async (address: string, blockTag = 'latest') => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  const balance = await provider.getBalance(address, blockTag);
  return balance.toHexString();
};

const sendResponse = (
  response: JsonRpcResponse,
  webViewRef: RefObject<WebView>
) => {
  if (webViewRef?.current) {
    const messageString = JSON.stringify(response);
    console.log('Sending response:', response);
    webViewRef.current.postMessage(messageString);
  }
};

const signMessage = async (message: any, privateKey: string) => {
  const wallet = await extractWallet(privateKey);
  return await wallet.signMessage(
    ethers.utils.isHexString(message) ? ethers.utils.arrayify(message) : message
  );
};

const _signTypedData = async (data: any, privateKey: string) => {
  const wallet = await extractWallet(privateKey);

  return await wallet._signTypedData(data.domain, data.types, data.message);
};

export const rpcMethods = {
  getCurrentAddress,
  handleChainIdRequest,
  handleSendTransaction,
  handleSignTransaction,
  handleGetBalance,
  signMessage,
  _signTypedData,
  sendResponse
};
