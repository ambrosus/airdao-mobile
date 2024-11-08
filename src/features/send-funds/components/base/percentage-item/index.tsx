import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface PercentageItemProps {
  symbol: boolean;
  percent: number;
  onPercentItemPress: (value: number) => void;
}

const MAXIMUM_AVAILABLE_VALUE = 100;

export const PercentageItem = React.memo<PercentageItemProps>(
  ({ symbol, percent, onPercentItemPress }) => {
    const label = useMemo(() => {
      if (percent === MAXIMUM_AVAILABLE_VALUE) {
        return 'Max';
      }

      return percent;
    }, [percent]);

    const isSymbolVisible = useMemo(() => {
      return symbol && percent !== MAXIMUM_AVAILABLE_VALUE;
    }, [percent, symbol]);

    const onPercentItemPressHandle = useCallback(
      () => onPercentItemPress(percent),
      [onPercentItemPress, percent]
    );

    return (
      <Pressable
        onPress={onPercentItemPressHandle}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      >
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {`${label}${isSymbolVisible ? '%' : ''}`}
        </Text>
      </Pressable>
    );
  }
);
