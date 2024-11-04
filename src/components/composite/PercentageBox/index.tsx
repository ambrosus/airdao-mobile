import React from 'react';
import { styles } from './styles';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface PercentageBoxProps {
  percentage: number;
  onPress: (percentage: number) => void;
}

export const PercentageBox = ({ percentage, onPress }: PercentageBoxProps) => {
  return (
    <Button onPress={() => onPress(percentage)} style={styles.percentageBox}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {percentage}%
      </Text>
    </Button>
  );
};
