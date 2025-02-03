import React, { useRef, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from '@metamask/react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BackIcon } from '@components/svg/icons';
import { CloseCircleIcon, ThreeDots } from '@components/svg/icons/v2';
import { WalletsActiveIcon } from '@components/svg/icons/v2/bottom-tabs-navigation';
import { COLORS } from '@constants/colors';
import { useBrowserStore } from '@entities/browser/model';

import {
  BottomSheetBrowserActions,
  BottomSheetBrowserWalletSelector
} from '@features/browser/components/templates';
import { setConnectedAddressTo } from '@lib';
import { styles } from './styles';

interface BrowserHeaderProps {
  uri: string;
  webViewRef: React.RefObject<WebView>;
  reload: () => void;
  closeWebView: () => void;
}

export const BrowserHeader = ({
  uri,
  reload,
  closeWebView
}: BrowserHeaderProps) => {
  const browserWalletSelectorRef = useRef<BottomSheetRef>(null);
  const browserActionsRef = useRef<BottomSheetRef>(null);

  const { selectedAddress, setSelectedAddress } = useBrowserStore();
  const cleanUrl = uri.replace(/^(https?:\/\/|hhtp:\/\/)/, '');
  const formattedUrl =
    cleanUrl.length > 25 ? `${cleanUrl.slice(0, 22)}...` : cleanUrl;

  const copyUri = useCallback(
    async () => await Clipboard.setStringAsync(uri),
    [uri]
  );
  const selectWallet = async (address: string) => {
    await setConnectedAddressTo(uri, address);
    setSelectedAddress(address);
    browserWalletSelectorRef?.current?.dismiss();
  };
  const openBrowserAction = () => {
    browserActionsRef?.current?.show();
  };

  const openWalletSelector = () => {
    browserWalletSelectorRef?.current?.show();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.walletButton}
          onPress={openWalletSelector}
        >
          <WalletsActiveIcon color={COLORS.neutral800} />
          <View style={styles.backIconWrapper}>
            <BackIcon scale={0.7} color={COLORS.neutral800} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={copyUri} style={styles.urlWrapper}>
          <Text color={COLORS.neutral900}>{formattedUrl}</Text>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={openBrowserAction}
            style={styles.actionButton}
          >
            <ThreeDots color={COLORS.neutral900} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={closeWebView} style={styles.actionButton}>
            <CloseCircleIcon color={COLORS.neutral900} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetBrowserWalletSelector
        selectedAddress={selectedAddress}
        ref={browserWalletSelectorRef}
        onWalletSelect={selectWallet}
      />
      <BottomSheetBrowserActions
        ref={browserActionsRef}
        uri={uri}
        title="HARBOR"
        onCopy={copyUri}
        onRefresh={reload}
      />
    </>
  );
};
