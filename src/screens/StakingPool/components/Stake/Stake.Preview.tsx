import { Row, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';
import { StringUtils, NumberUtils, scale, verticalScale } from '@utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

interface StakePreviewProps {
  walletAddress: string;
  amount: number;
  apy: number;
  onPressStake: () => unknown;
}

export const StakePreview = ({
  walletAddress,
  amount,
  apy,
  onPressStake
}: StakePreviewProps) => {
  const { t } = useTranslation();
  const usdAmount = useUSDPrice(amount);
  return (
    <View style={styles.container}>
      <Text
        fontSize={20}
        fontFamily="Inter_700Bold"
        fontWeight="700"
        color={COLORS.neutral800}
        style={{ alignSelf: 'center' }}
      >
        {t('staking.pool.preview')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          color={COLORS.neutral300}
          fontSize={16}
          fontWeight="600"
          fontFamily="Inter_600SemiBold"
        >
          {t('common.transaction.from')}
        </Text>
        <Text
          color={COLORS.neutral800}
          fontSize={16}
          fontFamily="Inter_500Medium"
          fontWeight="500"
        >
          {StringUtils.formatAddress(walletAddress, 6, 6)}
        </Text>
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          color={COLORS.neutral300}
          fontSize={16}
          fontWeight="600"
          fontFamily="Inter_600SemiBold"
        >
          {t('staking.pool.stake.amount')}
        </Text>
        <Row alignItems="center">
          <Text
            color={COLORS.neutral800}
            fontSize={16}
            fontWeight="700"
            fontFamily="Inter_700Bold"
          >
            {NumberUtils.limitDecimalCount(amount, 2)} AMB
          </Text>
          <Spacer value={scale(8)} horizontal />
          <Text
            color={COLORS.neutral400}
            fontSize={14}
            fontWeight="500"
            fontFamily="Inter_500Medium"
          >
            ${NumberUtils.limitDecimalCount(usdAmount, 2)}
          </Text>
        </Row>
      </Row>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          color={COLORS.neutral300}
          fontSize={16}
          fontWeight="600"
          fontFamily="Inter_600SemiBold"
        >
          {t('staking.pool.apy')}
        </Text>
        <Text
          color={COLORS.success500}
          fontSize={16}
          fontWeight="500"
          fontFamily="Inter_500Medium"
        >
          {apy}%
        </Text>
      </Row>
      <Spacer value={verticalScale(32)} />
      <PrimaryButton onPress={onPressStake}>
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral0}
        >
          {t('staking.pool.stake.now')}
        </Text>
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16)
  }
});
