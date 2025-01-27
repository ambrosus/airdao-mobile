import { StyleSheet } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

interface MnemonicSelectedProps {
  word: string;
  onPress: () => unknown;
  index: number;
}

export const MnemonicSelected = (props: MnemonicSelectedProps) => {
  const { onPress, word, index } = props;
  return (
    <Button style={styles.container} onPress={onPress}>
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
      {/* <Row alignItems="center">
        {countDisplay}
        {countDisplay !== null && <Spacer value={8} horizontal />}
        <Text
          align="center"
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={
            flow === 'mnemonic' ? buttonTextColorMnemonic : buttonTextColorInner
          }
        >
          {word.word}
        </Text>
      </Row> */}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
