import React from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useStakingPoolDetails } from '@entities/staking';
import { StakingPool } from '@models';
import { scale, verticalScale, TokenUtils, NumberUtils } from '@utils';
import { TokenLogo } from '../TokenLogo';

interface StakingPoolItemProps {
  stakingPool: StakingPool;
}

export const StakingPoolItem = (props: StakingPoolItemProps) => {
  const { stakingPool } = props;
  const poolStakingDetails = useStakingPoolDetails(stakingPool.token.name);
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
            {TokenUtils.truncatePoolTokenName(stakingPool.token.name)}
          </Text>
          <Spacer value={verticalScale(4)} />
          <Text
            color={COLORS.neutral400}
            fontFamily="Inter_500Medium"
            fontWeight="500"
          >
            {t('staking.current.stake', {
              amount: NumberUtils.formatDecimal(
                ethers.utils.formatEther(
                  poolStakingDetails?.user.raw ?? ethers.BigNumber.from(0)
                )
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
