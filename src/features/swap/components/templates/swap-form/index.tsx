import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { styles } from './styles';
import { KeyboardDismissingView, Spacer } from '@components/base';
import { FIELD } from '@features/swap/types';
import { scale } from '@utils/scaling';
import {
  InputWithTokenSelect,
  ReviewSwapButton
} from '@/features/swap/components/modular';
import { SwapReverseTokens } from '@/features/swap/components/composite';

export const SwapForm = () => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={20}
      behavior="height"
    >
      <KeyboardDismissingView style={styles.container}>
        <View style={styles.inner}>
          <View>
            <Spacer value={scale(22)} />
            <InputWithTokenSelect type={FIELD.TOKEN_A} />
            <SwapReverseTokens />
            <InputWithTokenSelect type={FIELD.TOKEN_B} />
          </View>

          <ReviewSwapButton />
        </View>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
