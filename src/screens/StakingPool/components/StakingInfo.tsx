import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useCurrencyRate } from '@hooks';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BigNumber } from 'ethers';

interface StakingInfoProps {
  totalStake: number;
  currency: CryptoCurrencyCode;
  userStaking: BigNumber;
  earnings: number;
  apy: number;
}

const Title = (props: PropsWithChildren) => {
  return (
    <Text
      fontSize={14}
      fontFamily="Inter_600SemiBold"
      fontWeight="600"
      color={COLORS.neutral300}
    >
      {props.children}
    </Text>
  );
};

export const StakingInfo = (props: StakingInfoProps) => {
  const { totalStake, currency, userStaking, earnings, apy } = props;
  const exchangeRate = useCurrencyRate(currency);
  const userStakingUsd =
    Number(NumberUtils.formatAmount(userStaking)) * exchangeRate;
  const earningsUsd = exchangeRate * earnings;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.row}
      >
        <Title>{t('staking.pool.total.stake')}</Title>
        <Row alignItems="center">
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
          >
            {NumberUtils.formatNumber(totalStake, 0)} {currency}
          </Text>
        </Row>
      </Row>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.row}
      >
        <Title>{t('staking.pool.apy')}</Title>
        <Text
          color={COLORS.success500}
          fontSize={14}
          fontFamily="Inter_600SemiBold"
          fontWeight="600"
        >
          {apy}%
        </Text>
      </Row>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={styles.row}
      >
        <Title>{t('staking.pool.user.stake')}</Title>
        <Row alignItems="center">
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            fontSize={14}
            fontWeight="600"
          >
            {NumberUtils.formatAmount(userStaking)} AMB
          </Text>
          <Spacer value={scale(8)} horizontal />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.neutral400}
            fontSize={14}
            fontWeight="500"
          >
            ${NumberUtils.formatNumber(userStakingUsd)}
          </Text>
        </Row>
      </Row>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{ ...styles.row, borderBottomWidth: 0 }}
      >
        <Title>{t('staking.pool.earnings')}</Title>
        <Row alignItems="center">
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral800}
            fontSize={14}
            fontWeight="600"
          >
            {NumberUtils.formatNumber(earnings)} AMB
          </Text>
          <Spacer value={scale(8)} horizontal />
          <Text
            fontFamily="Inter_500Medium"
            color={COLORS.neutral400}
            fontSize={14}
            fontWeight="500"
          >
            ${NumberUtils.formatNumber(earningsUsd)}
          </Text>
        </Row>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.neutral100
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral100,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16)
  }
});
