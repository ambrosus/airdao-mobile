import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useSwapSelectTokens } from '@features/swap/lib/hooks';
import { Divider } from '@/features/swap/components/base';
import { Button, Spacer } from '@components/base';
import { SwapIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';

export const SwapReverseTokens = () => {
  const { lastChangedInput, setLastChangedInput } = useSwapContextSelector();
  const { onReverseSelectedTokens } = useSwapSelectTokens();

  const onReverseSelectedTokensPress = useCallback(() => {
    onReverseSelectedTokens();
    setLastChangedInput(
      lastChangedInput === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A
    );
  }, [lastChangedInput, onReverseSelectedTokens, setLastChangedInput]);

  return (
    <>
      <Spacer value={scale(8)} />
      <Divider>
        <View style={styles.wrapper}>
          <Button onPress={onReverseSelectedTokensPress} style={styles.button}>
            <SwapIcon scale={0.75} color={COLORS.neutral400} />
          </Button>
        </View>
      </Divider>
      <Spacer value={scale(8)} />
    </>
  );
};
