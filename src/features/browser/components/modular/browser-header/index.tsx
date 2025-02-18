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

import { BottomSheetBrowserActions } from '@features/browser/components/templates';
import { StringUtils } from '@utils';
import { styles } from './styles';

interface BrowserHeaderProps {
  uri: string;
  webViewRef: React.RefObject<WebView>;
  reload: () => void;
  closeWebView: () => void;
  openWalletSelector?: () => void;
}

export const BrowserHeader = ({
  uri,
  reload,
  closeWebView,
  openWalletSelector
}: BrowserHeaderProps) => {
  const browserActionsRef = useRef<BottomSheetRef>(null);

  const copyUri = useCallback(
    async () => await Clipboard.setStringAsync(uri),
    [uri]
  );

  const openBrowserAction = () => {
    browserActionsRef?.current?.show();
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
          <Text color={COLORS.neutral900}>
            {StringUtils.formatUri({ uri })}
          </Text>
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
        // TODO dynamic change browser product name
        title="HARBOR"
        onCopy={copyUri}
        onRefresh={reload}
      />
    </>
  );
};
