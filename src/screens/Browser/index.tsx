// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { ethers } from 'ethers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Text } from '@components/base';
import Config from '@constants/config';
import { useWalletPrivateKey } from '@entities/wallet';

import {
  AMB_CHAIN_ID_DEC,
  AMB_CHAIN_ID_HEX
} from '@features/browser/constants';
import { INJECTED_PROVIDER_JS } from '@features/browser/lib';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';

const SOURCE = {
  // uri: 'https://7z2dkc.csb.app/'
  uri: 'https://metamask.github.io/test-dapp/'
};

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

export const BrowserScreen = () => {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const webViewRef = useRef<WebView>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const requestsInProgress = useRef(new Set());

  const extractWallet = useCallback(async () => {
    const privateKey = await _extractPrivateKey();
    const wallet = new ethers.Wallet(privateKey, createAMBProvider());
    return wallet;
  }, [_extractPrivateKey]);

  const reload = () => webViewRef.current?.reload();
  const back = () => webViewRef.current?.goBack();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1
    }),
    []
  );

  const getCurrentAddress = useCallback(async () => {
    try {
      const wallet = await extractWallet();
      return await wallet.getAddress();
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }, [extractWallet]);

  useEffect(() => {
    getCurrentAddress().then((address) => {
      if (address) {
        setConnectedAddress(address);
      }
    });
  }, [getCurrentAddress]);

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      const request: JsonRpcRequest = JSON.parse(event.nativeEvent.data);
      const { id, method, params } = request;

      if (requestsInProgress.current.has(id)) {
        return;
      }
      requestsInProgress.current.add(id);

      console.log('Incoming request:', { id, method, params });

      const response: JsonRpcResponse = {
        id,
        jsonrpc: '2.0',
        method
      };

      try {
        switch (method) {
          case 'net_version':
            response.result = AMB_CHAIN_ID_DEC;
            break;

          case 'eth_requestAccounts': {
            const address = await getCurrentAddress();
            if (!address) {
              throw new Error('No account available');
            }
            response.result = [address];
            setConnectedAddress(address);
            break;
          }

          case 'eth_accounts': {
            response.result = connectedAddress ? [connectedAddress] : [];
            break;
          }

          case 'wallet_requestPermissions': {
            const permissions = params[0];
            if (permissions?.eth_accounts) {
              const address = await getCurrentAddress();
              if (!address) {
                throw new Error('No account available');
              }
              response.result = [
                {
                  // eth_accounts permission
                  parentCapability: 'eth_accounts',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictReturnedAccounts',
                      value: [connectedAddress]
                    }
                  ]
                },
                {
                  // permitted chains permission
                  parentCapability: 'endowment:permitted-chains',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictChains',
                      value: [AMB_CHAIN_ID_HEX]
                    }
                  ]
                }
              ];
              setConnectedAddress(address);
            } else {
              response.error = {
                code: 4200,
                message: 'Requested permission is not available'
              };
            }
            break;
          }

          case 'wallet_revokePermissions': {
            const permissions = params[0];
            if (permissions?.eth_accounts) {
              // Set a flag to prevent re-rendering loops
              const wasConnected = !!connectedAddress;

              // Update local state only if needed
              if (wasConnected) {
                setConnectedAddress(null);

                // Send a single update to the WebView
                const updateScript = `
                  (function() {
                    if (window.ethereum && window.ethereum.selectedAddress) {
                      window.ethereum.selectedAddress = null;
                      // Emit event only once
                      const event = new CustomEvent('accountsChanged', { detail: [] });
                      window.dispatchEvent(event);
                    }
                  })();
                  true; // Required for iOS
                `;

                // Use requestAnimationFrame to prevent multiple updates
                webViewRef.current?.injectJavaScript(`
                  requestAnimationFrame(() => {
                    ${updateScript}
                  });
                `);
              }

              response.result = null;
            } else {
              response.error = {
                code: 4200,
                message: 'Permission to revoke is not recognized'
              };
            }
            break;
          }

          case 'wallet_getPermissions': {
            if (connectedAddress) {
              response.result = [
                {
                  // eth_accounts permission
                  parentCapability: 'eth_accounts',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictReturnedAccounts',
                      value: [connectedAddress]
                    }
                  ]
                },
                {
                  // permitted chains permission
                  parentCapability: 'endowment:permitted-chains',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictChains',
                      value: ['AMB_CHAIN_ID_HEX'] // AMB Chain ID
                    }
                  ]
                }
              ];
            } else {
              response.result = [];
            }
            break;
          }

          case 'eth_chainId':
            response.result = await handleChainIdRequest();
            break;

          case 'eth_sendTransaction':
            response.result = await handleSendTransaction(params[0]);
            break;

          case 'eth_signTransaction':
            response.result = await handleSignTransaction(params[0]);
            break;

          case 'personal_sign':
            response.result = await handlePersonalSign(params);
            break;

          case 'eth_sign':
            response.result = await handleEthSign(params);
            break;

          case 'wallet_switchEthereumChain':
            response.result = await handleSwitchChain(params[0]);
            break;

          case 'wallet_addEthereumChain':
            response.result = await handleAddChain(params[0]);
            break;

          case 'eth_getBalance':
            response.result = await handleGetBalance(params[0], params[1]);
            break;

          default:
            response.error = {
              code: 4200,
              message: `Method ${method} not supported`
            };
        }

        sendResponse(response);
      } finally {
        requestsInProgress.current.delete(id);
      }
    } catch (error) {
      console.error('Failed to handle WebView message:', error);
      sendResponse({
        id: request?.id || -1,
        jsonrpc: '2.0',
        error: {
          code: 4001,
          message: error.message || 'Unknown error occurred'
        }
      });
    }
  };

  // Handler implementations
  const handleChainIdRequest = async () => {
    // Get current chain ID in hex format
    return `0x${Number(AMB_CHAIN_ID_DEC).toString(16)}`;
  };

  const handleSendTransaction = async (txParams: any) => {
    // Handle transaction sending
    const wallet = await extractWallet();
    const tx = await wallet.sendTransaction(txParams);
    return tx.hash;
  };

  const handleSignTransaction = async (txParams: any) => {
    // Handle transaction signing
    const wallet = await extractWallet();
    const signedTx = await wallet.signTransaction(txParams);
    return signedTx;
  };

  const handlePersonalSign = async ([message, address, password]: any[]) => {
    // Handle personal_sign
    const wallet = await extractWallet();
    const signature = await wallet.signMessage(message);
    return signature;
  };

  const handleEthSign = async ([address, message]: any[]) => {
    // Handle eth_sign
    const wallet = await extractWallet();
    const signature = await wallet.signMessage(message);
    return signature;
  };

  const handleSwitchChain = async (params: { chainId: string }) => {
    // Handle chain switching
    const wallet = await extractWallet();
    await wallet.switchEthereumChain(parseInt(params.chainId, 16));
    return null;
  };

  const handleAddChain = async (chainParams: any) => {
    // Handle adding new chain
    const wallet = await extractWallet();
    await wallet.addChain(chainParams);
    return null;
  };

  const handleGetBalance = async (address: string, blockTag = 'latest') => {
    // Get account balance
    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    const balance = await provider.getBalance(address, blockTag);
    return balance.toHexString();
  };

  const sendResponse = (response: JsonRpcResponse) => {
    if (webViewRef.current) {
      const messageString = JSON.stringify(response);
      console.log('Sending response:', response);
      webViewRef.current.postMessage(messageString);
    }
  };

  useEffect(() => {
    if (webViewRef.current) {
      const updateScript = `
        if (window.ethereum) {
          window.ethereum.selectedAddress = ${
            connectedAddress ? `'${connectedAddress}'` : 'null'
          };
          const listeners = window.ethereum._events.get('accountsChanged');
          if (listeners) {
            listeners.forEach(listener => listener(${
              connectedAddress ? `['${connectedAddress}']` : '[]'
            }));
          }
        }
      `;
      webViewRef.current.injectJavaScript(updateScript);
    }
  }, [connectedAddress]);

  return (
    <SafeAreaView style={containerStyle}>
      <Row>
        <Button onPress={reload}>
          <Text>Reload</Text>
        </Button>
        <Button onPress={back}>
          <Text>Go back</Text>
        </Button>
        {connectedAddress && (
          <Text numberOfLines={1}>Connected: {connectedAddress}</Text>
        )}
      </Row>
      <WebView
        incognito={true}
        userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
        ref={webViewRef}
        source={SOURCE}
        nativeConfig={{ props: { webContentsDebuggingEnabled: true } }}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={INJECTED_PROVIDER_JS}
        onMessage={handleWebViewMessage}
        style={containerStyle}
        webviewDebuggingEnabled={__DEV__}
      />
    </SafeAreaView>
  );
};
