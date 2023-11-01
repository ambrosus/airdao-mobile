import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import React from 'react';
import { StyleSheet } from 'react-native';

interface MnemonicRandomProps {
  word: string;
  onPress: () => unknown;
  selected: boolean;
  disabled: boolean;
}

export const MnemonicRandom = (props: MnemonicRandomProps) => {
  const { onPress, disabled, selected, word } = props;
  return (
    <Button style={styles.container} onPress={onPress} disabled={disabled}>
      <Text
        align="center"
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={selected ? COLORS.neutral300 : COLORS.neutral900}
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
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: 1000
  }
});
