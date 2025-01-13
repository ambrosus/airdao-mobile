import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Row, Spacer, Text } from '@components/base';
import { SecondaryButton } from '@components/modular';
import { StakeIcon, WithdrawIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import useLocalization from '@contexts/Localizations';
import { useGetPoolYieldAPY, useStakeHBRStore } from '@entities/harbor';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import { NumberUtils, scale } from '@utils';
import { styles } from './styles';
import { YieldLabel } from '../../base';
import { StakedDetails } from '../../composite';

const RenderAPYHeaderNode = ({ apy }: { apy?: number }) => {
  const { currentLanguage } = useLocalization();
  const { t } = useTranslation();
  const label = `🔥 ${t('harbor.apy.value')} `;

  const apyValue = useMemo(() => {
    switch (currentLanguage) {
      case 'en':
        return `${apy ?? '0'}%`;
      case 'tr':
        return `%${apy ?? '0'}`;
    }
  }, [apy, currentLanguage]);

  return (
    <Row alignItems="center" justifyContent="center">
      <Text fontSize={14} fontFamily="Inter_500Medium" color={COLORS.neutral0}>
        {label}
        <Text fontSize={14} fontFamily="Inter_700Bold" color={COLORS.neutral0}>
          {apyValue}
        </Text>
      </Text>
    </Row>
  );
};

interface StakeAMBWithApyLabelProps {
  logs: IAvailableWithdrawLogs | null;
}

export const StakeAMBWithApyLabel = ({ logs }: StakeAMBWithApyLabelProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();

  const { stake, deposit, limitsConfig, totalPoolLimit } = useStakeHBRStore();
  const apy = useGetPoolYieldAPY();

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

  const onStakeButtonPress = () => {
    navigation.navigate('StakeAMBScreen', { apy });
  };

  const onWithdrawButtonPress = () => {
    navigation.navigate('WithdrawHarborPoolScreen', {
      token: CryptoCurrencyCode.AMB,
      logs
    });
  };

  const disabled = useMemo(() => deposit.isZero(), [deposit]);
  const isWithdrawalDisabled = useMemo(() => stake.isZero(), [stake]);

  const primaryButtonStyle = useMemo(
    () => ({
      ...styles.button,
      backgroundColor: COLORS[disabled ? 'alphaBlack5' : 'brand600']
    }),
    [disabled]
  );

  return (
    <>
      <YieldLabel label={t('harbor.apy.label')} />

      <View style={styles.container}>
        <RenderAPYHeaderNode apy={apy} />
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

          <Spacer value={8} />

          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.footer}
          >
            <SecondaryButton
              style={primaryButtonStyle}
              disabled={disabled}
              onPress={onStakeButtonPress}
            >
              <Row justifyContent="center" alignItems="center">
                <StakeIcon
                  color={COLORS[disabled ? 'neutral400' : 'neutral0']}
                />
                <Spacer horizontal value={scale(10)} />
                <Text
                  align="justify"
                  color={COLORS[disabled ? 'neutral400' : 'neutral0']}
                >
                  {t('staking.header')}
                </Text>
              </Row>
            </SecondaryButton>

            <SecondaryButton
              style={styles.button}
              disabled={isWithdrawalDisabled}
              onPress={onWithdrawButtonPress}
            >
              <Row justifyContent="center" alignItems="center">
                <WithdrawIcon
                  color={
                    COLORS[isWithdrawalDisabled ? 'neutral400' : 'neutral900']
                  }
                />
                <Spacer horizontal value={scale(10)} />
                <Text
                  align="justify"
                  color={
                    COLORS[isWithdrawalDisabled ? 'neutral400' : 'neutral900']
                  }
                >
                  {t('harbor.withdraw.header')}
                </Text>
              </Row>
            </SecondaryButton>
          </Row>
        </StakedDetails>
      </View>
    </>
  );
};
