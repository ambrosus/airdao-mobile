import React, { useCallback, useRef } from 'react';
import { View, Image, PanResponder } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { ReceiveFunds } from '../ReceiveFunds';
import { useWallet } from '@hooks';

interface WalletDepositFundsProps {
  readonly onRefresh?: () => void;
}

export const WalletDepositFunds = ({ onRefresh }: WalletDepositFundsProps) => {
  const { wallet } = useWallet();

  const receiveFundsBottomSheetRef = useRef<BottomSheetRef>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > -10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Check if the swipe direction is down
        if (gestureState.dy > -10 && typeof onRefresh === 'function')
          onRefresh();
      }
    })
  ).current;

  const onReceiveFundsShowBottomSheet = useCallback(
    () => receiveFundsBottomSheetRef.current?.show(),
    []
  );

  return (
    <>
      <View {...panResponder.panHandlers} style={styles.container}>
        <Image
          style={styles.thumbnail}
          source={require('@assets/images/deposit-funds.png')}
        />

        <Text
          fontSize={16}
          color={'#94979C'}
          fontFamily="Inter_400Regular"
          numberOfLines={2}
          style={styles.description}
        >
          Deposit Funds to unlock your wallet features.
        </Text>

        <PrimaryButton
          onPress={onReceiveFundsShowBottomSheet}
          style={styles.button}
        >
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            Deposit funds
          </Text>
        </PrimaryButton>

        <BottomSheet ref={receiveFundsBottomSheetRef} title="Receive">
          <View style={styles.receiveFunds}>
            <ReceiveFunds address={wallet?.address ?? ''} />
          </View>
        </BottomSheet>
      </View>
    </>
  );
};
