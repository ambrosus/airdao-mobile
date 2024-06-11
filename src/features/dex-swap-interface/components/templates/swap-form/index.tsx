import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { styles } from './styles';
import { Spacer, KeyboardDismissingView } from '@components/base';
import {
  InputWithCurrencySelector,
  SwapButton,
  SwapDivider
} from '@features/dex-swap-interface/components/modular';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { scale } from '@utils/scaling';

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
            <InputWithCurrencySelector type={FIELD.INPUT} />
            <SwapDivider />
            <InputWithCurrencySelector type={FIELD.OUTPUT} />
          </View>

          <SwapButton />
        </View>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
