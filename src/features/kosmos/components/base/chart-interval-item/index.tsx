import React, { useMemo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { scale } from '@utils';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface ChartIntervalItemProps {
  interval: { label: string; value: number };
  selectedInterval: number;
  onChangeInterval: (value: number) => void;
}

export const ChartIntervalItem = ({
  interval,
  selectedInterval,
  onChangeInterval
}: ChartIntervalItemProps) => {
  const itemContainerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      borderRadius: scale(101),
      paddingHorizontal: scale(16),
      paddingVertical: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: selectedInterval === interval.value ? 1 : 0,
      borderColor: COLORS.primary100,
      backgroundColor:
        selectedInterval === interval.value ? COLORS.primary50 : 'transparent'
    };
  }, [interval, selectedInterval]);

  const onSelectIntervalValue = () => onChangeInterval(interval.value);

  const intervalValueColor = useMemo(() => {
    return interval.value === selectedInterval
      ? COLORS.brand500
      : COLORS.neutral600;
  }, [interval.value, selectedInterval]);

  const intervalValueFontFamily = useMemo(() => {
    return interval.value === selectedInterval
      ? 'Inter_600SemiBold'
      : 'Inter_500Medium';
  }, [interval.value, selectedInterval]);

  return (
    <TouchableOpacity
      onPress={onSelectIntervalValue}
      style={itemContainerStyle}
    >
      <Text
        fontSize={14}
        fontFamily={intervalValueFontFamily}
        color={intervalValueColor}
      >
        {interval.label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};
