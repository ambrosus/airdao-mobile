import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor/model';
import { StakeAMBInput } from '@features/harbor/components/modular';
import { Token } from '@models';
import { NumberUtils } from '@utils';
import { styles } from './styles';

interface AmbInputWithPoolDetailsProps {
  tokenInstance: Token;
  error?: string;
}

export const AmbInputWithPoolDetails = ({
  tokenInstance,
  error
}: AmbInputWithPoolDetailsProps) => {
  const { t } = useTranslation();
  const { totalPoolLimit, limitsConfig } = useStakeHBRStore();

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

  const perAddressLimit = useMemo(
    () =>
      `${NumberUtils.numberToTransformedLocale(
        ethers.utils.formatEther(limitsConfig?.maxStakePerUserValue)
      )}`,
    [limitsConfig?.maxStakePerUserValue]
  );

  return (
    <View style={styles.container}>
      <StakeAMBInput error={error} tokenInstance={tokenInstance} />

      <View style={styles.details}>
        {/*  First Row Item */}
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            {t('kosmos.lock.period')}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {stakeLockPeriod} {t('common.days')}
          </Text>
        </Row>
        {/*  Second Row Item */}
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            {t('harbor.stake.limit.address')}
          </Text>
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral900}
          >
            {perAddressLimit}{' '}
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color="rgba(88, 94, 119, 1)"
            >
              {CryptoCurrencyCode.AMB}
            </Text>
          </Text>
        </Row>
        {/*  Third Row Item */}
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            {t('harbor.stake.pool.limit')}
          </Text>
          <Row alignItems="center">
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
    </View>
  );
};
