/* eslint-disable no-console */
// tslint:disable:no-console

import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonStackParamsList } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { useBrowserStore } from '@entities/browser/model';

import { BrowserHeader } from '@features/browser/components/modular/browser-header';
import {
  BottomSheetApproveBrowserAction,
  BottomSheetBrowserModal,
  BottomSheetBrowserWalletSelector
} from '@features/browser/components/templates';
import {
  handleWebViewMessage,
  INJECTED_PROVIDER_JS
} from '@features/browser/lib';
import { connectWallet } from '@features/browser/utils';
import { useAllAccounts } from '@hooks/database';
import { getConnectedAddressTo } from '@lib';
import { Cache, CacheKey } from '@lib/cache';
import { isIos, StringUtils } from '@utils';
import { styles } from './styles';

export const BrowserScreen = () => {
  const { params } =
    useRoute<RouteProp<CommonStackParamsList, 'BrowserScreen'>>();
  const { uri } = params;
  const SOURCE = {
    uri
  };
  const { data: accounts } = useAllAccounts();

  const formattedUrl = StringUtils.formatUri({ uri });
  const navigation = useNavigation();

  const browserModalRef = useRef<BottomSheetRef>(null);
  const browserApproveRef = useRef<BottomSheetRef>(null);
  const webViewRef = useRef<WebView>(null);

  const reload = useCallback(() => webViewRef.current?.reload(), [webViewRef]);
  const goForward = useCallback(
    () => webViewRef.current?.goForward(),
    [webViewRef]
  );
  const goBack = useCallback(() => webViewRef.current?.goBack(), [webViewRef]);
  const closeWebView = useCallback(() => navigation.goBack(), [navigation]);

  const {
    connectedAddress,
    connectedAccount,
    setConnectedAddress,
    setConnectedAccount
  } = useBrowserStore();
  const { data: allAccounts } = useAllAccounts();

  const [hasSwiped, setHasSwiped] = useState(false);

  useEffect(() => {
    const getSelectedWallet = async () => {
      const _selectedAddress = await getConnectedAddressTo(uri);
      const account = accounts.find(
        (item) => item.address === _selectedAddress
      );
      setConnectedAddress(_selectedAddress || '');
      setConnectedAccount(account || null);
    };
    getSelectedWallet().then();

    if (webViewRef.current && connectedAddress) {
      connectWallet(connectedAddress, webViewRef);
    }
  }, [
    accounts,
    allAccounts,
    connectedAddress,
    setConnectedAccount,
    setConnectedAddress,
    uri
  ]);

  const onMessageEventHandler = useCallback(
    async (event: WebViewMessageEvent) => {
      if (isIos) {
        event.persist();
      }
      try {
        const privateKey = (await Cache.getItem(
          // @ts-ignore
          `${CacheKey.WalletPrivateKey}-${connectedAccount?._raw.hash ?? ''}`
        )) as string;

        await handleWebViewMessage({
          uri,
          event,
          webViewRef,
          privateKey,
          browserApproveRef,
          browserWalletSelectorRef
        });
      } catch (error) {
        throw error;
      }
    },
    // @ts-ignore
    [connectedAccount?._raw.hash, uri]
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

  const browserWalletSelectorRef = useRef<BottomSheetRef>(null);

  const openWalletSelector = () => {
    browserWalletSelectorRef?.current?.show();
  };
  const { top } = useSafeAreaInsets();
  return (
    <>
      <View style={{ marginTop: top }}>
        <BrowserHeader
          openWalletSelector={openWalletSelector}
          reload={reload}
          closeWebView={closeWebView}
          webViewRef={webViewRef}
          uri={uri}
        />
      </View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        shouldCancelWhenOutside={false}
        activeOffsetX={[-10, 10]}
      >
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
            webviewDebuggingEnabled={__DEV__}
          />
        </View>
      </PanGestureHandler>
      <BottomSheetBrowserWalletSelector
        uri={formattedUrl}
        selectedAddress={connectedAddress}
        ref={browserWalletSelectorRef}
      />

      <BottomSheetBrowserModal ref={browserModalRef} />
      <BottomSheetApproveBrowserAction ref={browserApproveRef} uri={uri} />
    </>
  );
};
