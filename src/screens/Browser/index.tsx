import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload
} from 'react-native-gesture-handler';
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
import { styles } from './styles';

export const BrowserScreen = () => {
  const { params } =
    useRoute<RouteProp<CommonStackParamsList, 'BrowserScreen'>>();
  const { uri } = params;
  const SOURCE = {
    uri
  };
  const navigation = useNavigation();

  const browserModalRef = useRef<BottomSheetRef>(null);
  const webViewRef = useRef<WebView>(null);

  const reload = useCallback(() => webViewRef.current?.reload(), [webViewRef]);
  const goForward = useCallback(
    () => webViewRef.current?.goForward(),
    [webViewRef]
  );
  const goBack = useCallback(() => webViewRef.current?.goBack(), [webViewRef]);
  const closeWebView = useCallback(() => navigation.goBack(), [navigation]);

  const { connectedAddress, setSelectedAddress } = useBrowserStore();
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { data: allAccounts } = useAllAccounts();

  const [hasSwiped, setHasSwiped] = useState(false);

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

  const onGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    const { translationX } = event.nativeEvent;

    const onLeftSwap = translationX < -100;
    const onRightSwap = translationX > 100;

    if (!hasSwiped) {
      if (onLeftSwap) {
        goForward();
        setHasSwiped(true);
        setTimeout(() => setHasSwiped(false), 300);
      } else if (onRightSwap) {
        goBack();
        setHasSwiped(true);
        setTimeout(() => setHasSwiped(false), 300);
      }
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <BrowserHeader
        reload={reload}
        closeWebView={closeWebView}
        webViewRef={webViewRef}
        uri={uri}
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.webViewWrapper}>
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
        </View>
      </PanGestureHandler>
      <BottomSheetBrowserModal ref={browserModalRef} />
    </SafeAreaView>
  );
};
