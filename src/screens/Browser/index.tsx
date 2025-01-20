import React, { useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from '@metamask/react-native-webview';
import { ethers } from 'ethers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Text } from '@components/base';
import { useWalletPrivateKey } from '@entities/wallet';
import { injectedJavaScript } from '@features/browser/lib';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';

const SOURCE = {
  uri: 'https://7z2dkc.csb.app/'
};

export const BrowserScreen = () => {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const webViewRef = useRef<WebView>(null);

  const reload = () => webViewRef.current?.reload();
  const back = () => webViewRef.current?.goBack();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1
    }),
    []
  );

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    const { method, params } = JSON.parse(event.nativeEvent.data);

    const privateKey = await _extractPrivateKey();
    const wallet = new ethers.Wallet(privateKey, createAMBProvider());

    switch (method) {
      case 'personal_sign':
        if (params.length < 2) {
          sendResponse(method, {
            error: 'Invalid parameters for personal_sign'
          });
          return;
        }
        try {
          const message = params[0];
          const walletAddress = params[1];
          const signature = await signMessage(message, walletAddress);
          sendResponse(method, { result: signature });
        } catch (error) {
          sendResponse(method, {
            error: (error as { message: string }).message
          });
        }
        break;

      case 'eth_requestAccounts':
        const accounts = [wallet.address];
        sendResponse(method, { result: accounts });
        break;

      case 'eth_chainId':
        // Respond with chainId
        sendResponse(method, { result: '0x414e' });
        break;

      case 'eth_networkVersion':
        // Respond with network version
        sendResponse(method, { result: '16718' });
        break;

      case 'eth_blockNumber':
        // Respond with block number
        sendResponse(method, { result: '0x10d4f' });
        break;
      case 'eth_getBalance':
        // Respond with block number
        sendResponse(method, { result: await wallet.getBalance() });
        break;

      default:
        sendResponse(method, { error: `Unsupported method: ${method}` });
    }
  };

  const sendResponse = (
    method: any,
    response: { error?: any; result?: string | ethers.BigNumber | string[] }
  ) => {
    const message = JSON.stringify({ method, ...response });
    webViewRef.current?.postMessage(message);
  };

  const signMessage = async (
    message: string | ethers.utils.Bytes,
    walletAddress: string
  ) => {
    const privateKey = await _extractPrivateKey(); // Replace with your wallet's private key
    const wallet = new ethers.Wallet(privateKey, createAMBProvider());
    const signature = await wallet.signMessage(message);

    // Verify that the signed message corresponds to the wallet address
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Recovered address does not match the wallet address.');
    }

    return signature;
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
      </Row>
      <WebView
        ref={webViewRef}
        source={SOURCE}
        nativeConfig={{ props: { webContentsDebuggingEnabled: true } }}
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        style={containerStyle}
      />
    </SafeAreaView>
  );
};
