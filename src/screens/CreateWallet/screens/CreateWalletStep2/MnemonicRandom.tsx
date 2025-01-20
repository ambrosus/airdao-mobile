import React from 'react';
import { Button, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './Step2.styles';

interface MnemonicRandomProps {
  word: string;
  onPress: () => unknown;
  selected: boolean;
  disabled: boolean;
}

export const MnemonicRandom = (props: MnemonicRandomProps) => {
  const { onPress, disabled, selected, word } = props;
  return (
    <Button style={styles.mnemonicRandom} onPress={onPress} disabled={disabled}>
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
