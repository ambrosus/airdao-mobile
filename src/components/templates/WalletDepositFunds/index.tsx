import React, { useCallback, useRef } from 'react';
import { View, Image } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { ReceiveFunds } from '../ReceiveFunds';
import { useWallet } from '@hooks';

export const WalletDepositFunds = () => {
  const { wallet } = useWallet();

  const receiveFundsBottomSheetRef = useRef<BottomSheetRef>(null);

  const onReceiveFundsShowBottomSheet = useCallback(
    () => receiveFundsBottomSheetRef.current?.show(),
    []
  );

  return (
    <>
      <View style={styles.container}>
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
      </View>

      <BottomSheet ref={receiveFundsBottomSheetRef} title="Receive">
        <View style={styles.receiveFunds}>
          <ReceiveFunds address={wallet?.address ?? ''} />
        </View>
      </BottomSheet>
    </>
  );
};
