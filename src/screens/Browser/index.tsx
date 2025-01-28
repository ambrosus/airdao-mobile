import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Text } from '@components/base';
import { useBrowserStore } from '@entities/browser/model';
import { useWalletPrivateKey } from '@entities/wallet';

import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import {
  handleWebViewMessage,
  INJECTED_PROVIDER_JS
} from '@features/browser/lib';

const SOURCE = {
  // uri: 'https://x3na.com/'
  uri: 'https://metamask.github.io/test-dapp/'
};

export const BrowserScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const { connectedAddress } = useBrowserStore();
  const { _extractPrivateKey } = useWalletPrivateKey();

  const reload = () => webViewRef.current?.reload();
  const back = () => webViewRef.current?.goBack();
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1
    }),
    []
  );

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

  const onMessageEventHandler = useCallback(
    async (event: WebViewMessageEvent) => {
      event.persist();
      try {
        const privateKey = await _extractPrivateKey();
        await handleWebViewMessage({ event, webViewRef, privateKey });
      } catch (error) {
        throw error;
      }
    },
    [_extractPrivateKey]
  );

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
        onMessage={onMessageEventHandler}
        style={containerStyle}
        webviewDebuggingEnabled={__DEV__}
      />
    </SafeAreaView>
  );
};
