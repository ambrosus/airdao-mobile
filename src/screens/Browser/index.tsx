import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonStackParamsList } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';
import { useWalletPrivateKey } from '@entities/wallet';

import { BrowserHeader } from '@features/browser/components/modular/browser-header';
import { BottomSheetBrowserModal } from '@features/browser/components/templates';
import { AMB_CHAIN_ID_HEX } from '@features/browser/constants';
import {
  handleWebViewMessage,
  INJECTED_PROVIDER_JS
} from '@features/browser/lib';
import { useAllAccounts } from '@hooks/database';
import { getConnectedAddressTo } from '@lib';

export const BrowserScreen = () => {
  const { params } =
    useRoute<RouteProp<CommonStackParamsList, 'BrowserScreen'>>();
  const { uri } = params;
  const SOURCE = {
    uri
  };

  const browserModalRef = useRef<BottomSheetRef>(null);
  const webViewRef = useRef<WebView>(null);

  const { connectedAddress, setSelectedAddress } = useBrowserStore();
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { data: allAccounts } = useAllAccounts();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1
    }),
    []
  );

  useEffect(() => {
    const getSelectedWallet = async () => {
      const _selectedAddress = await getConnectedAddressTo(uri);
      setSelectedAddress(_selectedAddress || allAccounts[0].address || '');
    };
    getSelectedWallet();

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
  }, [allAccounts, connectedAddress, setSelectedAddress, uri]);

  const onMessageEventHandler = useCallback(
    async (event: WebViewMessageEvent) => {
      event.persist();
      try {
        const privateKey = await _extractPrivateKey();
        await handleWebViewMessage({
          event,
          webViewRef,
          privateKey,
          browserModalRef,
          uri
        });
      } catch (error) {
        throw error;
      }
    },
    [_extractPrivateKey, uri]
  );

  return (
    <SafeAreaView style={containerStyle}>
      <BrowserHeader webViewRef={webViewRef} uri={uri} />
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
      <BottomSheetBrowserModal ref={browserModalRef} />
    </SafeAreaView>
  );
};
