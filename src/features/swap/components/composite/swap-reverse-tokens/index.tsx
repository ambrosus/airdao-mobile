import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import {
  useSwapFieldsHandler,
  useSwapSelectTokens
} from '@features/swap/lib/hooks';
import { Divider } from '@/features/swap/components/base';
import { Button, Spacer } from '@components/base';
import { SwapOppositeArrowsIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';

export const SwapReverseTokens = () => {
  const { onReverseSelectedTokens } = useSwapSelectTokens();
  const { updateReceivedTokensOutput } = useSwapFieldsHandler();

  const { setIsExactIn, selectedTokens, setIsReversedTokens } =
    useSwapContextSelector();

  const onReverseSelectedTokensPress = useCallback(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    setIsExactIn((prevState) => !prevState);
    setIsReversedTokens((prevState) => !prevState);
    onReverseSelectedTokens();

    if (TOKEN_A && TOKEN_B) {
      setTimeout(async () => {
        await updateReceivedTokensOutput();
      }, 250);
    }
  }, [
    onReverseSelectedTokens,
    selectedTokens,
    setIsExactIn,
    setIsReversedTokens,
    updateReceivedTokensOutput
  ]);

  return (
    <>
      <Spacer value={scale(8)} />
      <Divider>
        <View style={styles.wrapper}>
          <Button onPress={onReverseSelectedTokensPress} style={styles.button}>
            <SwapOppositeArrowsIcon scale={0.75} color={COLORS.neutral400} />
          </Button>
        </View>
      </Divider>
      <Spacer value={scale(8)} />
    </>
  );
};
