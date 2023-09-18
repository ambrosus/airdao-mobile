import React from 'react';
import { StyleSheet } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import {
  CheckmarkCircleIcon,
  ChevronRightIcon,
  LogoGradientCircular
} from '@components/svg/icons';
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
        <LogoGradientCircular />
        <Spacer value={scale(16)} horizontal />
        <Text numberOfLines={1}>{wallet.name}</Text>
      </Row>
      <Row alignItems="center">
        {isSelectedWallet && <CheckmarkCircleIcon color={COLORS.success400} />}
        <Spacer value={scale(16)} horizontal />
        <ChevronRightIcon color={COLORS.neutral300} />
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
