import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './Step2.styles';

interface MnemonicSelectedProps {
  word: string;
  onPress: () => unknown;
  index: number;
}

export const MnemonicSelected = (props: MnemonicSelectedProps) => {
  const { onPress, word, index } = props;
  return (
    <Button style={styles.mnemonicSelected} onPress={onPress}>
      <Text
        align="right"
        fontFamily="Inter_600SemiBold"
        fontSize={14}
        color={COLORS.neutral400}
        style={{ minWidth: 16 }}
      >
        {index}
      </Text>
      <Spacer value={8} horizontal />
      <Text
        align="center"
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={COLORS.success400}
      >
        {word}
      </Text>
    </Button>
  );
};
