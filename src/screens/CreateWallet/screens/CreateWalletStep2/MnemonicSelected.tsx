import { Button, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import React from 'react';
import { StyleSheet } from 'react-native';

interface MnemonicSelectedProps {
  word: string;
  onPress: () => unknown;
  index: number;
  isPlacedCorrectly: boolean;
}

export const MnemonicSelected = (props: MnemonicSelectedProps) => {
  const { onPress, isPlacedCorrectly, word, index } = props;
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
      <Spacer value={scale(8)} horizontal />
      <Text
        align="center"
        fontSize={14}
        fontFamily="Inter_600SemiBold"
        color={isPlacedCorrectly ? COLORS.success400 : COLORS.error400}
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
    minHeight: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center'
  }
});
