import { useCallback } from 'react';
import { View } from 'react-native';
import { Divider } from '@/features/swap/components/base';
import { Button, Spacer } from '@components/base';
import { SwapOppositeArrowsIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapFieldsHandler,
  useSwapSelectTokens,
  useSwapTokens
} from '@features/swap/lib/hooks';
import { scale } from '@utils';
import { styles } from './styles';

export const SwapReverseTokens = () => {
  const { onReverseSelectedTokens } = useSwapSelectTokens();
  const { updateReceivedTokensOutput } = useSwapFieldsHandler();
  const { setIsExactIn } = useSwapContextSelector();
  const { tokenToSell, tokenToReceive } = useSwapTokens();

  const onReverseSelectedTokensPress = useCallback(() => {
    setIsExactIn((prevState) => !prevState);
    onReverseSelectedTokens();

    if (tokenToSell.TOKEN && tokenToReceive.TOKEN) {
      setTimeout(async () => {
        await updateReceivedTokensOutput();
      });
    }
  }, [
    onReverseSelectedTokens,
    setIsExactIn,
    tokenToReceive.TOKEN,
    tokenToSell.TOKEN,
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
