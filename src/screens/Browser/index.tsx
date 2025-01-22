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
import { StyleProp, ViewStyle, Alert } from 'react-native';
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
import {
  INJECTED_PROVIDER_JS,
  REVOKE_PERMISSIONS_JS,
  UPDATE_ETHEREUM_STATE_JS
} from '@features/browser/lib';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';

const SOURCE = {
  // uri: 'https://airquest.xyz/'
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

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      logger(event);
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
            console.log('eth_requestAccounts called');
            const address = await getCurrentAddress();
            if (!address) {
              throw new Error('No account available');
            }
            response.result = [address];
            setConnectedAddress(address);

            webViewRef.current?.injectJavaScript(
              UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
            );

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
                  parentCapability: 'eth_accounts',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictReturnedAccounts',
                      value: [address]
                    }
                  ]
                },
                {
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

              if (webViewRef.current) {
                webViewRef.current.injectJavaScript(
                  UPDATE_ETHEREUM_STATE_JS(address, AMB_CHAIN_ID_HEX)
                );
              }

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
              if (connectedAddress) {
                setConnectedAddress(null);
                response.result = [
                  {
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

                if (webViewRef.current) {
                  webViewRef.current.injectJavaScript(REVOKE_PERMISSIONS_JS);
                }
              } else {
                response.result = [
                  {
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
              }
            } else if (permissions?.['endowment:permitted-chains']) {
              response.error = {
                code: 4200,
                message: 'Chain permissions cannot be revoked'
              };
            } else {
              response.error = {
                code: 4200,
                message: 'Permission to revoke is not recognized'
              };
            }
            break;
          }

          case 'wallet_getPermissions': {
            const basePermissions = [
              {
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

            if (connectedAddress) {
              response.result = [
                {
                  parentCapability: 'eth_accounts',
                  date: Date.now(),
                  caveats: [
                    {
                      type: 'restrictReturnedAccounts',
                      value: [connectedAddress]
                    }
                  ]
                },
                ...basePermissions
              ];
            } else {
              response.result = basePermissions;
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

          case 'personal_sign': {
            try {
              console.log('Personal sign request:', params);
              const [message, address] = params;

              if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
                throw new Error('Address mismatch');
              }

              const userConfirmation = new Promise((resolve, reject) => {
                Alert.alert(
                  'Sign Message',
                  `Do you want to sign this message?\n\nMessage: ${message}\n\nAddress: ${address}`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => reject(new Error('User rejected signing')),
                      style: 'cancel'
                    },
                    {
                      text: 'Sign',
                      onPress: () => resolve(true),
                      style: 'default'
                    }
                  ],
                  { cancelable: false }
                );
              });

              await userConfirmation;

              const wallet = await extractWallet();
              const signature = await wallet.signMessage(
                ethers.utils.isHexString(message)
                  ? ethers.utils.arrayify(message)
                  : message
              );

              console.log('Signature generated:', signature);
              response.result = signature;
            } catch (error) {
              console.error('Personal sign error:', error);
              throw error;
            }
            break;
          }

          case 'eth_sign': {
            try {
              const [address, message] = params;

              if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
                throw new Error('Address mismatch');
              }

              const userConfirmation = new Promise((resolve, reject) => {
                Alert.alert(
                  'Sign Message',
                  `Do you want to sign this message?\n\nMessage: ${message}\n\nAddress: ${address}`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => reject(new Error('User rejected signing')),
                      style: 'cancel'
                    },
                    {
                      text: 'Sign',
                      onPress: () => resolve(true),
                      style: 'default'
                    }
                  ],
                  { cancelable: false }
                );
              });

              await userConfirmation;

              const wallet = await extractWallet();
              const signature = await wallet.signMessage(message);

              console.log('Signature generated:', signature);
              response.result = signature;
            } catch (error) {
              console.error('Eth sign error:', error);
              throw error;
            }
            break;
          }

          case 'wallet_switchEthereumChain':
            response.result = await handleSwitchChain(params[0]);
            break;

          case 'wallet_addEthereumChain':
            response.result = await handleAddChain(params[0]);
            break;

          case 'eth_getBalance':
            response.result = await handleGetBalance(params[0], params[1]);
            break;

          case 'eth_signTypedData_v4':
          case 'eth_signTypedData': {
            try {
              console.log('Sign typed data request:', params);
              const [address, typedData] = params;

              if (address.toLowerCase() !== connectedAddress?.toLowerCase()) {
                throw new Error('Address mismatch');
              }

              const data =
                typeof typedData === 'string'
                  ? JSON.parse(typedData)
                  : typedData;

              const userConfirmation = new Promise((resolve, reject) => {
                Alert.alert(
                  'Sign Typed Data',
                  `Do you want to sign this data?\n\nFrom: ${address}\n\nData: ${JSON.stringify(
                    data,
                    null,
                    2
                  )}`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => reject(new Error('User rejected signing')),
                      style: 'cancel'
                    },
                    {
                      text: 'Sign',
                      onPress: () => resolve(true),
                      style: 'default'
                    }
                  ],
                  { cancelable: false }
                );
              });

              await userConfirmation;

              const wallet = await extractWallet();
              const signature = await wallet._signTypedData(
                data.domain,
                data.types,
                data.message
              );

              console.log('Signature generated:', signature);
              response.result = signature;
            } catch (error) {
              console.error('Failed to sign typed data:', error);
              throw error;
            }
            break;
          }

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
      sendResponse({
        id: -1,
        jsonrpc: '2.0',
        error: {
          code: 4001,
          message: (error as Error).message || 'Unknown error occurred'
        }
      });
    }
  };

  const handleChainIdRequest = async () => {
    return `0x${Number(AMB_CHAIN_ID_DEC).toString(16)}`;
  };

  const handleSendTransaction = async (txParams: any) => {
    const wallet = await extractWallet();
    const tx = await wallet.sendTransaction(txParams);
    return tx.hash;
  };

  const handleSignTransaction = async (txParams: any) => {
    const wallet = await extractWallet();
    return await wallet.signTransaction(txParams);
  };

  const handleSwitchChain = async (params: { chainId: string }) => {
    const wallet = await extractWallet();
    await wallet.switchEthereumChain(parseInt(params.chainId, 16));
    return null;
  };

  const handleAddChain = async (chainParams: any) => {
    const wallet = await extractWallet();
    await wallet.addChain(chainParams);
    return null;
  };

  const handleGetBalance = async (address: string, blockTag = 'latest') => {
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
    if (webViewRef.current && connectedAddress) {
      const updateScript = `
        (function() {
          try {
            if (window.ethereum) {
              window.ethereum.selectedAddress = '${connectedAddress}';
              window.ethereum.emit('accountsChanged', ['${connectedAddress}']);
              window.ethereum.emit('connect', { chainId: '${AMB_CHAIN_ID_HEX}' });
            }
          } catch(e) {
            console.error('Connection update error:', e);
          }
          return true;
        })();
      `;
      webViewRef.current.injectJavaScript(updateScript);
    }
  }, [connectedAddress]);

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
        ref={webViewRef}
        source={SOURCE}
        nativeConfig={{
          props: { webContentsDebuggingEnabled: true }
        }}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={INJECTED_PROVIDER_JS}
        onMessage={handleWebViewMessage}
        style={containerStyle}
        webviewDebuggingEnabled={__DEV__}
      />
    </SafeAreaView>
  );
};
