import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

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
        fontFamily="Inter_500Medium"
        color={selected ? COLORS.neutral300 : COLORS.neutral900}
      >
        {word}
      </Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    borderRadius: 1000
  }
});
