import { useMemo } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SwapReverseTokens } from '@/features/swap/components/composite';
import {
  InputWithTokenSelect,
  ReviewSwapButton,
  SwapCurrencyRate
} from '@/features/swap/components/modular';
import { KeyboardDismissingView, Spacer } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapInterface, useSwapTokens } from '@features/swap/lib/hooks';
import { FIELD } from '@features/swap/types';
import { plateVisibility } from '@features/swap/utils';
import { scale, isIos } from '@utils';
import { styles } from './styles';

const KEYBOARD_BEHAVIOR = isIos ? 'padding' : 'height';

export const SwapForm = () => {
  const { isEstimatedToken } = useSwapInterface();
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();
  const { tokensRoute } = useSwapTokens();

  const tokenToSell = useMemo(
    () => ({
      TOKEN: selectedTokens.TOKEN_A,
      AMOUNT: selectedTokensAmount.TOKEN_A
    }),
    [selectedTokens.TOKEN_A, selectedTokensAmount.TOKEN_A]
  );

  const tokenToReceive = useMemo(
    () => ({
      TOKEN: selectedTokens.TOKEN_B,
      AMOUNT: selectedTokensAmount.TOKEN_B
    }),
    [selectedTokens.TOKEN_B, selectedTokensAmount.TOKEN_B]
  );

  const isCurrencyRateVisible = useMemo(() => {
    return plateVisibility(
      tokenToSell.TOKEN,
      tokenToSell.AMOUNT,
      tokenToReceive.TOKEN,
      tokenToReceive.AMOUNT
    );
  }, [tokenToReceive, tokenToSell]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={isIos ? 20 : 0}
      behavior={KEYBOARD_BEHAVIOR}
    >
      <KeyboardDismissingView style={styles.container}>
        <View style={styles.container}>
          <View>
            <Spacer value={scale(22)} />
            <InputWithTokenSelect
              type={FIELD.TOKEN_A}
              estimated={isEstimatedToken.tokenA}
            />
            <SwapReverseTokens />
            <InputWithTokenSelect
              type={FIELD.TOKEN_B}
              estimated={isEstimatedToken.tokenB}
            />

            <Spacer value={scale(32)} />

            {isCurrencyRateVisible && (
              <SwapCurrencyRate
                tokenToSell={tokenToSell.TOKEN.address}
                tokenToReceive={tokenToReceive.TOKEN.address}
                tokensRoute={tokensRoute}
              />
            )}
          </View>

          <View style={styles.footer}>
            <ReviewSwapButton />
          </View>
        </View>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
