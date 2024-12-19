import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useCurrencyRate } from '@hooks';
import { moderateScale, scale, verticalScale, NumberUtils } from '@utils';
import React, { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BigNumber, ethers } from 'ethers';

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
  const { t } = useTranslation();
  const { totalStake, currency, userStaking, earnings, apy } = props;
  const exchangeRate = useCurrencyRate(currency);
  const userStakingUsd =
    parseFloat(NumberUtils.formatAmount(userStaking)) * exchangeRate;

  const totalStakingUSD = totalStake * exchangeRate;

  const earningsUsd = exchangeRate * earnings;

  return (
    <View style={styles.container}>
      <ShadowCombinedContainer>
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
            <Spacer value={scale(8)} horizontal />
            <Text
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
              fontSize={14}
              fontWeight="500"
            >
              ${NumberUtils.minimiseAmount(totalStakingUSD)}
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
              {NumberUtils.formatDecimal(ethers.utils.formatEther(userStaking))}{' '}
              AMB
            </Text>
            <Spacer value={scale(8)} horizontal />
            <Text
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
              fontSize={14}
              fontWeight="500"
            >
              ${NumberUtils.minimiseAmount(userStakingUsd)}
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
              ${NumberUtils.minimiseAmount(earningsUsd)}
            </Text>
          </Row>
        </Row>
      </ShadowCombinedContainer>
    </View>
  );
};

const ShadowCombinedContainer = ({ children }: { children: ReactNode }) => (
  <View style={styles.innerShadow}>
    <View style={styles.outerShadow}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.neutral100
  },
  innerShadow: {
    shadowOffset: { width: 0, height: -1 },
    shadowColor: 'rgb(47, 43, 67)',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(16)
  },
  outerShadow: {
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: 'rgb(47, 43, 67)',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(16)
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral100,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16)
  }
});
