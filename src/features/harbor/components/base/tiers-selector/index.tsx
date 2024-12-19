import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Row, Spacer, Text } from '@components/base';
import { CircleInfoIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import {
  EMPTY_SELECTED_TIER,
  REWARD_TIERS_LIST
} from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { TierRewardItem } from '@entities/harbor/model/types';
import { TokenReward } from '@features/harbor/components/base/token-reward';
import { calculateClaimAmount } from '@features/harbor/hooks';
import { isAndroid, scale } from '@utils';
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
    activeAmbTier,
    setActiveAmbTier,
    activeBondTier,
    setActiveBondTier,
    claimAmount,
    setRewardAmount,
    loading,
    data: { tier: userTier }
  } = useHarborStore();

  const [toolTipVisible, setToolTipVisible] = useState(false);

  const setOppositePart = (
    oppositeArray: TierRewardItem[],
    oppositeSetter: (payload: TierRewardItem) => void,
    selectedItem: TierRewardItem
  ) => {
    if (selectedItem?.value === 1) {
      oppositeSetter(EMPTY_SELECTED_TIER);
    }
    const oppositePart = oppositeArray.find(
      (oppositeItem) => oppositeItem?.value + selectedItem?.value === 1
    ) as TierRewardItem;
    oppositeSetter(oppositePart);
  };

  const onAmbPress = (ambItem: TierRewardItem) => {
    setRewardAmount(calculateClaimAmount(claimAmount, ambItem, 'amb'));
    setActiveAmbTier(ambItem);
    setOppositePart(REWARD_TIERS_LIST.bond, setActiveBondTier, ambItem);
  };

  const onBondPress = (bondItem: TierRewardItem) => {
    setRewardAmount(calculateClaimAmount(claimAmount, bondItem, 'bond'));
    setActiveBondTier(bondItem);
    setOppositePart(REWARD_TIERS_LIST.amb, setActiveAmbTier, bondItem);
  };
  useEffect(() => {
    setRewardAmount(calculateClaimAmount(claimAmount, activeAmbTier, 'amb'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimAmount]);

  useEffect(() => {
    setToolTipVisible(false);
  }, [loading]);

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
        <Tooltip
          backgroundColor="transparent"
          disableShadow
          arrowStyle={isAndroid ? { bottom: 20 } : {}}
          contentStyle={[styles.toolTipContainerStyle]}
          isVisible={toolTipVisible}
          content={
            <Text fontSize={scale(12)} color={COLORS.neutral0}>
              {t('harbor.tier.1.content')}
            </Text>
          }
          placement="top"
          onClose={() => setToolTipVisible(!toolTipVisible)}
        >
          <TouchableOpacity onPress={() => setToolTipVisible(!toolTipVisible)}>
            <CircleInfoIcon
              color={toolTipVisible ? 'transparent' : COLORS.neutral500}
            />
          </TouchableOpacity>
        </Tooltip>
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
