import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { WalletDBModel } from '@database';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { WalletAvatars } from '@components/templates/WalletPicker/WalletPicker.constants';

interface WalletItemProps {
  wallet: WalletDBModel;
  isSelectedWallet: boolean;
  index: number;
}

export const WalletItem = (props: WalletItemProps) => {
  const { wallet, isSelectedWallet, index } = props;

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.container}
    >
      <Row alignItems="center" width={scale(224)}>
        <View style={styles.avatar}>{WalletAvatars[index]}</View>
        <Spacer value={scale(16)} horizontal />
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
          numberOfLines={1}
        >
          {wallet.name}
        </Text>
      </Row>
      <Row alignItems="center">
        {isSelectedWallet && (
          <Image
            source={require('@assets/icons/checkmark-circle.png')}
            style={{ height: moderateScale(20), width: moderateScale(20) }}
          />
        )}
        <Spacer value={scale(16)} horizontal />
        <ChevronDownIcon rotate="270deg" color={COLORS.neutral300} />
      </Row>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16)
  },
  avatar: {
    borderRadius: 1000,
    overflow: 'hidden'
  }
});
