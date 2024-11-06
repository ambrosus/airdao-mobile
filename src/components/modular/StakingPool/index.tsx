import { Row, Spacer, Text } from '@components/base';
import { StakingPool } from '@models';
import React from 'react';
import { View } from 'react-native';
import { TokenLogo } from '../TokenLogo';
import { scale, verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { usePoolDetailsByName } from '@contexts';
import { NumberUtils } from '@utils/number';
import { BigNumber } from 'ethers';
import { TokenUtils } from '@utils/token';

interface StakingPoolItemProps {
  stakingPool: StakingPool;
}

export const StakingPoolItem = (props: StakingPoolItemProps) => {
  const { stakingPool } = props;
  const poolStakingDetails = usePoolDetailsByName(stakingPool.token.name);
  const { t } = useTranslation();

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      // style={{ opacity: stakingPool.isActive ? 1 : 0.5 }}
    >
      <Row alignItems="center">
        <TokenLogo token={stakingPool.token.name} />
        <Spacer value={scale(12)} horizontal />
        <View>
          <Text
            color={COLORS.neutral900}
            fontFamily="Inter_500Medium"
            fontWeight="500"
          >
            {TokenUtils.truncatePoolTokenName(stakingPool.token.name)}
          </Text>
          <Spacer value={verticalScale(4)} />
          <Text
            color={COLORS.neutral400}
            fontFamily="Inter_500Medium"
            fontWeight="500"
          >
            {t('staking.current.stake', {
              amount: NumberUtils.formatAmount(
                poolStakingDetails?.user.raw ?? BigNumber.from(0),
                0
              ),
              symbol: 'AMB'
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
