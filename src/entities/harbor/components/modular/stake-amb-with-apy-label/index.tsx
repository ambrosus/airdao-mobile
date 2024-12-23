import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useGetPoolYieldAPY, useStakeHBRStore } from '@entities/harbor';
import { NumberUtils } from '@utils';
import { styles } from './styles';
import { YieldLabel } from '../../base';
import { StakedDetails } from '../../composite';

const RenderAPYHeaderNode = () => {
  const apy = useGetPoolYieldAPY();
  return (
    <Row alignItems="center" justifyContent="center">
      <Text fontSize={14} fontFamily="Inter_500Medium" color={COLORS.neutral0}>
        🔥 Hot APY{' '}
        <Text fontSize={14} fontFamily="Inter_700Bold" color={COLORS.neutral0}>
          {apy ?? '0'}%
        </Text>
      </Text>
    </Row>
  );
};

export const StakeAMBWithApyLabel = () => {
  const { t } = useTranslation();
  const { stake, limitsConfig, totalPoolLimit } = useStakeHBRStore();

  const stakeLockPeriod = useMemo(
    () => (Number(limitsConfig?.stakeLockPeriod) / 86400).toFixed(0) || '0',
    [limitsConfig?.stakeLockPeriod]
  );

  const { totalLimit, availableLimit } = useMemo(
    () => ({
      totalLimit: `${NumberUtils.abbreviateNumber(
        +ethers.utils.formatEther(limitsConfig.maxTotalStakeValue)
      )} ${CryptoCurrencyCode.AMB}`,
      availableLimit: `${NumberUtils.abbreviateNumber(
        +ethers.utils.formatEther(totalPoolLimit)
      )} ${CryptoCurrencyCode.AMB}`
    }),
    [limitsConfig.maxTotalStakeValue, totalPoolLimit]
  );

  return (
    <>
      <YieldLabel label="Stake HBR to access high-yield AMB staking." />

      <View style={styles.container}>
        <RenderAPYHeaderNode />
        <StakedDetails
          amount={NumberUtils.numberToTransformedLocale(
            ethers.utils.formatEther(stake)
          )}
          token={CryptoCurrencyCode.AMB}
        >
          <View style={styles.stakedNativeInnerDetails}>
            <Row alignItems="center" justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color="rgba(88, 94, 119, 1)"
              >
                {t('kosmos.lock.period')}
              </Text>

              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {stakeLockPeriod} {t('common.days')}
              </Text>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color="rgba(88, 94, 119, 1)"
              >
                {t('harbor.stake.pool.limit')}
              </Text>

              <Row>
                <Text
                  fontSize={14}
                  fontFamily="Inter_500Medium"
                  color={COLORS.neutral800}
                >
                  {availableLimit}
                </Text>
                <Spacer horizontal value={2} />
                <Text fontSize={14} fontFamily="Inter_500Medium">
                  /{totalLimit}
                </Text>
              </Row>
            </Row>
          </View>
        </StakedDetails>
      </View>
    </>
  );
};
