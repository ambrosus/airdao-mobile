import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

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
