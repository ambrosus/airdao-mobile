import { Row, Spacer, Text } from '@components/base';
import { StakingPool } from '@models';
import React from 'react';
import { View } from 'react-native';
import { TokenLogo } from '../TokenLogo';
import { scale, verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';

interface StakingPoolItemProps {
  stakingPool: StakingPool;
}

export const StakingPoolItem = (props: StakingPoolItemProps) => {
  const { stakingPool } = props;
  const { t } = useTranslation();

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Row alignItems="center">
        <TokenLogo token={stakingPool.token.name} />
        <Spacer value={scale(12)} horizontal />
        <View>
          <Text
            color={COLORS.neutral900}
            fontFamily="Inter_500Medium"
            fontWeight="500"
          >
            {stakingPool.token.name}
          </Text>
          <Spacer value={verticalScale(4)} />
          <Text
            color={COLORS.neutral400}
            fontFamily="Inter_500Medium"
            fontWeight="500"
          >
            {t('staking.current.stake', {
              amount: 20,
              symbol: stakingPool.token.symbol
            })}
          </Text>
        </View>
      </Row>
      <Text
        color={COLORS.success500}
        fontSize={14}
        fontFamily="Inter_500Medium"
      >
        {stakingPool.apy}%
      </Text>
    </Row>
  );
};
