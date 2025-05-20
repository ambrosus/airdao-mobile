import { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { REWARD_TIERS_LIST } from '@entities/harbor/constants';
import { useHarborStore, TierRewardItem } from '@entities/harbor/model';
import { TokenReward } from '@features/harbor/components/base/token-reward';
import { calculateClaimAmount } from '@features/harbor/lib';
import { scale } from '@utils';
import { styles } from './styles';

interface TiersContainerProps {
  ambAmount: string;
}

export const TiersSelector = ({ ambAmount }: TiersContainerProps) => {
  const { t } = useTranslation();
  const {
    activeAmbTier,
    setActiveAmbTier,
    claimAmount,
    setRewardAmount,
    data: { tier: userTier }
  } = useHarborStore();

  const onAmbPress = (ambItem: TierRewardItem) => {
    setRewardAmount(calculateClaimAmount(claimAmount, ambItem));
    setActiveAmbTier(ambItem);
  };

  useEffect(() => {
    setRewardAmount(calculateClaimAmount(claimAmount, activeAmbTier));
  }, [claimAmount, activeAmbTier, setRewardAmount]);

  return (
    <View>
      <Row alignItems="center">
        <Text fontSize={scale(14)} color={COLORS.neutral900}>
          {t('harbor.tiers.container.header')}{' '}
        </Text>
        <Text fontSize={scale(14)}>
          {t('harbor.tier')} {userTier}
        </Text>
        <Spacer horizontal value={scale(8)} />
      </Row>

      <Spacer value={scale(8)} />
      <View style={styles.wrapper}>
        <TokenReward
          userTier={userTier}
          rewardTokenName={'amb'}
          selectedTokenReward={activeAmbTier}
          amount={ambAmount}
          onItemPress={onAmbPress}
          rewardTiers={REWARD_TIERS_LIST.amb}
        />
      </View>
    </View>
  );
};
