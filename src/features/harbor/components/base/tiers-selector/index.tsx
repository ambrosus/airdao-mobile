import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Row, Spacer, Text } from '@components/base';
import { CircleInfoIcon } from '@components/svg/icons/v2/harbor';
import { COLORS } from '@constants/colors';
import { DEVICE_HEIGHT } from '@constants/variables';
import { REWARD_TIERS_LIST } from '@entities/harbor/constants';
import { useHarborStore, TierRewardItem } from '@entities/harbor/model';
import { TokenReward } from '@features/harbor/components/base/token-reward';
import { calculateClaimAmount } from '@features/harbor/lib';
import { isAndroid, isIos, scale } from '@utils';
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
    loading,
    data: { tier: userTier }
  } = useHarborStore();

  const [toolTipVisible, setToolTipVisible] = useState(false);

  const onAmbPress = (ambItem: TierRewardItem) => {
    setRewardAmount(calculateClaimAmount(claimAmount, ambItem));
    setActiveAmbTier(ambItem);
  };

  useEffect(() => {
    setRewardAmount(calculateClaimAmount(claimAmount, activeAmbTier));
  }, [claimAmount, activeAmbTier, setRewardAmount]);

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
          showChildInTooltip={isIos}
          backgroundColor="transparent"
          topAdjustment={isAndroid ? -DEVICE_HEIGHT * 0.05 : 0}
          disableShadow
          arrowStyle={isAndroid ? { bottom: 20 } : {}}
          contentStyle={[styles.toolTipContainerStyle]}
          isVisible={toolTipVisible}
          content={
            <View>
              <Text fontSize={scale(14)} color={COLORS.neutral0}>
                {t(`harbor.tier.${userTier}.header`)}
              </Text>
              <Spacer value={scale(8)} />
              <Text fontSize={scale(12)} color={COLORS.neutral0}>
                {t(`harbor.tier.${userTier}.content`)}
              </Text>
            </View>
          }
          placement="top"
          onClose={() => setToolTipVisible(!toolTipVisible)}
        >
          <TouchableOpacity onPress={() => setToolTipVisible(!toolTipVisible)}>
            <CircleInfoIcon color={COLORS.neutral500} />
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
      </View>
    </View>
  );
};
