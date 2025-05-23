import React, { useRef, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from '@metamask/react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BackIcon } from '@components/svg/icons';
import { CloseCircleIcon, ThreeDots } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';

import { useBrowserStore } from '@entities/browser/model';
import { BottomSheetBrowserActions } from '@features/browser/components/templates';
import { isAndroid, StringUtils } from '@utils';
import { styles } from './styles';

interface BrowserHeaderProps {
  uri: string;
  webViewRef: React.RefObject<WebView>;
  openWalletSelector: () => void;
  reload: () => void;
  goBack: (() => void) | null;
  closeWebView: () => void;
}
export const BrowserHeader = ({
  uri,
  reload,
  closeWebView,
  goBack
}: // openWalletSelector
BrowserHeaderProps) => {
  const browserActionsRef = useRef<BottomSheetRef>(null);

  const { productTitle } = useBrowserStore();
  const title = productTitle || StringUtils.formatUri({ uri });

  const copyUri = useCallback(
    async () => await Clipboard.setStringAsync(uri),
    [uri]
  );

  const openBrowserAction = () => {
    browserActionsRef?.current?.show();
  };

  const onRefresh = () => {
    reload();
    browserActionsRef?.current?.dismiss();
  };

  const onGoBack = () => {
    if (goBack) {
      goBack();
    }
  };

  // temporary disabled this logic
  // const WalletSelector = () => (
  //   <TouchableOpacity style={styles.walletButton} onPress={openWalletSelector}>
  //     <WalletsActiveIcon color={COLORS.neutral800} />
  //     <View style={styles.backIconWrapper}>
  //       <BackIcon scale={0.7} color={COLORS.neutral800} />
  //     </View>
  //   </TouchableOpacity>
  // );
  const GoBackButton = () => {
    return (
      <TouchableOpacity onPress={onGoBack}>
        <BackIcon color={COLORS.neutral900} />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          {goBack && isAndroid && <GoBackButton />}
          {/* <WalletSelector /> */}
        </View>
        <TouchableOpacity onPress={copyUri} style={styles.centerContainer}>
          <Text style={styles.urlText}>{StringUtils.formatUri({ uri })}</Text>
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

      <BottomSheetBrowserActions
        ref={browserActionsRef}
        uri={uri}
        title={title}
        onCopy={copyUri}
        onRefresh={onRefresh}
      />
    </>
  );
};
