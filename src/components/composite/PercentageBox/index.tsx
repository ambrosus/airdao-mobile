import React from 'react';
import { styles } from './styles';
import { Button, Text } from '@components/base';

interface PercentageBoxProps {
  percentage: number;
  onPress: (percentage: number) => void;
}

export const PercentageBox = ({ percentage, onPress }: PercentageBoxProps) => {
  return (
    <Button onPress={() => onPress(percentage)} style={styles.percentageBox}>
      <Text>{percentage}%</Text>
    </Button>
  );
};
