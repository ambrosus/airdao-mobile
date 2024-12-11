import React, { useState } from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { useTranslation } from 'react-i18next';
import { scale } from '@utils/scaling';
import { TokenReward } from './components';
import {
  EMPTY_SELECTED_TIER,
  REWARD_TIERS_LIST
} from '@entities/harbor/constants';
import { TierRewardItem } from '@entities/harbor/model/types';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface TiersContainerProps {
  bondAmount: string;
  ambAmount: string;
}
export const TiersSelector = ({
  bondAmount,
  ambAmount
}: TiersContainerProps) => {
  const { t } = useTranslation();
  const {
    data: { tier: userTier }
  } = useHarborStore();

  const [activeAmbTier, setActiveAmbTier] = useState<TierRewardItem>(
    REWARD_TIERS_LIST.amb[0]
  );
  const [activeBondTier, setActiveBondTier] = useState<TierRewardItem>(
    REWARD_TIERS_LIST.bond[2]
  );

  const setOppositePart = (
    oppositeArray: TierRewardItem[],
    oppositeSetter: (payload: TierRewardItem) => void,
    selectedItem: TierRewardItem
  ) => {
    if (selectedItem.value === 1) {
      oppositeSetter(EMPTY_SELECTED_TIER);
    }
    const oppositePart = oppositeArray.find(
      (oppositeItem) => oppositeItem.value + selectedItem.value === 1
    ) as TierRewardItem;
    oppositeSetter(oppositePart);
  };

  const onAmbPress = (ambItem: TierRewardItem) => {
    setActiveAmbTier(ambItem);
    setOppositePart(REWARD_TIERS_LIST.bond, setActiveBondTier, ambItem);
  };

  const onBondPress = (bondItem: TierRewardItem) => {
    setActiveBondTier(bondItem);
    setOppositePart(REWARD_TIERS_LIST.amb, setActiveAmbTier, bondItem);
  };

  return (
    <View>
      <Row>
        <Text fontSize={14} color={COLORS.neutral900}>
          {t('harbor.tiers.container.header')}{' '}
        </Text>
        <Text fontSize={14}>
          {t('harbor.tier')} {userTier}
        </Text>
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
        <Spacer value={scale(12)} />
        <TokenReward
          userTier={userTier}
          rewardTokenName={'bond'}
          selectedTokenReward={activeBondTier}
          amount={bondAmount}
          onItemPress={onBondPress}
          rewardTiers={REWARD_TIERS_LIST.bond}
        />
      </View>
    </View>
  );
};
