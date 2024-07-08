import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { styles } from './styles';
import { KeyboardDismissingView, Spacer } from '@components/base';
import { FIELD } from '@features/swap/types';
import { scale } from '@utils/scaling';
import {
  InputWithTokenSelect,
  ReviewSwapButton,
  TokenInfoPlate
} from '@/features/swap/components/modular';
import { SwapReverseTokens } from '@/features/swap/components/composite';
import { isIos } from '@utils/isPlatform';
import { useSwapInterface } from '@features/swap/lib/hooks';

const KEYBOARD_BEHAVIOR = isIos ? 'padding' : 'height';

export const SwapForm = () => {
  const { isEstimatedToken } = useSwapInterface();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={20}
      behavior={KEYBOARD_BEHAVIOR}
    >
      <KeyboardDismissingView style={styles.container}>
        <View style={styles.inner}>
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

            <Spacer value={scale(24)} />
            <TokenInfoPlate />
          </View>

          <ReviewSwapButton />
        </View>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
