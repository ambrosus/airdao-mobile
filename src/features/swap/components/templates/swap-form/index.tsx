import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SwapReverseTokens } from '@/features/swap/components/composite';
import {
  InputWithTokenSelect,
  ReviewSwapButton,
  SwapCurrencyRate
} from '@/features/swap/components/modular';
import { KeyboardDismissingView, Spacer } from '@components/base';
import { useSwapInterface } from '@features/swap/lib/hooks';
import { FIELD } from '@features/swap/types';
import { scale, isIos } from '@utils';
import { styles } from './styles';

const KEYBOARD_BEHAVIOR = isIos ? 'padding' : 'height';

export const SwapForm = () => {
  const { isEstimatedToken } = useSwapInterface();

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
            <SwapCurrencyRate />
          </View>

          <View style={styles.footer}>
            <ReviewSwapButton />
          </View>
        </View>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
