import React, { useMemo } from 'react';
import { View } from 'react-native';
import { BottomSheet } from '@components/composite';
import { WalletConnectIcon } from '@components/svg/icons';
import { FailedIcon } from '@components/svg/icons/v2';
import {
  useWalletConnectContextSelector,
  useWalletKitEventsManager
} from '@features/wallet-connect/lib/hooks';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';
import { styles } from './styles';
import { RenderModalViewByStep } from '../../modular';

export const WalletConnectModal = () => {
  const {
    proposal,
    request,
    approvalConnectionBottomSheetRef,
    isWalletKitInitiated,
    walletConnectStep
  } = useWalletConnectContextSelector();

  useWalletKitEventsManager(isWalletKitInitiated);

  const isError = useMemo(() => {
    return walletConnectStep.toLowerCase().includes('error');
  }, [walletConnectStep]);

  if (!proposal && !request?.session) {
    return null;
  }

  return (
    <BottomSheet
      ref={approvalConnectionBottomSheetRef}
      containerStyle={styles.bottomSheet}
      swiperIconVisible={false}
      swipingEnabled={false}
      height="100%"
    >
      <View style={styles.container}>
        {walletConnectStep ===
        CONNECT_VIEW_STEPS.EIP155_TRANSACTION ? null : !isError ? (
          <WalletConnectIcon />
        ) : (
          <FailedIcon />
        )}

        {RenderModalViewByStep(walletConnectStep)}
      </View>
    </BottomSheet>
  );
};
