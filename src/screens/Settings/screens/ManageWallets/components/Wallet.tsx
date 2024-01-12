import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { AirdaoBlueIcon, ChevronDownIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { WalletDBModel } from '@database';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

interface WalletItemProps {
  wallet: WalletDBModel;
  isSelectedWallet: boolean;
}

export const WalletItem = (props: WalletItemProps) => {
  const { wallet, isSelectedWallet } = props;

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.container}
    >
      <Row alignItems="center" width={scale(224)}>
        <AirdaoBlueIcon scale={1.25} />
        <Spacer value={scale(16)} horizontal />
        <Text numberOfLines={1}>{wallet.name}</Text>
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
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.alphaBlack5
  }
});
