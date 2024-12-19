import React, { useMemo } from 'react';
import { View } from 'react-native';
import { BottomSheet } from '@components/composite';
import { WalletConnectIcon } from '@components/svg/icons';
import { FailedIcon } from '@components/svg/icons/v2';
import {
  useWalletConnectContextSelector,
  useWalletKitEventsManager
} from '@features/wallet-connect/lib/hooks';
import { styles } from './styles';
import { RenderModalViewByStep } from '../../modular';

export const WalletConnectModal = () => {
  const {
    proposal,
    approvalConnectionBottomSheetRef,
    isWalletKitInitiated,
    walletConnectStep
  } = useWalletConnectContextSelector();

  useWalletKitEventsManager(isWalletKitInitiated);

  const isError = useMemo(() => {
    return walletConnectStep.toLowerCase().includes('error');
  }, [walletConnectStep]);

  if (!proposal) {
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
        {!isError ? <WalletConnectIcon /> : <FailedIcon />}

        {RenderModalViewByStep(walletConnectStep)}
      </View>
    </BottomSheet>
  );
};
