import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { BottomSheet } from '@components/composite';
import {
  useWalletConnectContextSelector,
  useWalletKitEventsManager
} from '@features/wallet-connect/lib/hooks';
import { WalletConnectIcon } from '@components/svg/icons';
import { RenderModalViewByStep } from '../../modular';
import { FailedIcon } from '@components/svg/icons/v2';

export const WalletConnectModal = () => {
  const {
    approvalConnectionBottomSheetRef,
    isWalletKitInitiated,
    walletConnectStep
  } = useWalletConnectContextSelector();

  useWalletKitEventsManager(isWalletKitInitiated);

  const isError = useMemo(() => {
    return walletConnectStep.toLowerCase().includes('error');
  }, [walletConnectStep]);

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
