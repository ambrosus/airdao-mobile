import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@components/base';
import { TierRewardItem } from '@entities/harbor/model/types';
import { styles } from './styles';
import { scale } from '@utils/scaling';

interface TierItemProps {
  rewardValue: TierRewardItem;
  userTier: number;
  isActive: boolean;
}

export const TierItem = ({
  rewardValue,
  userTier,
  isActive
}: TierItemProps) => {
  const { value, availableOn } = rewardValue;

  const isItemAvailable = userTier >= availableOn;

  const availableStyle = useMemo(() => styles.available, []);
  const activeStyle = useMemo(() => styles.active, []);
  const disabledStyle = useMemo(() => styles.disabled, []);

  const _styles = useMemo(() => {
    switch (true) {
      case isActive:
        return activeStyle;
      case isItemAvailable:
        return availableStyle;
      default:
        return disabledStyle;
    }
  }, [isActive, activeStyle, isItemAvailable, availableStyle, disabledStyle]);
  return (
    <View style={{ ...styles.main, backgroundColor: _styles.backgroundColor }}>
      <Text fontSize={scale(14)} color={_styles.color}>
        {value * 100}%
      </Text>
    </View>
  );
};
