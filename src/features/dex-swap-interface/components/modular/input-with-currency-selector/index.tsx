import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { CurrencySelector } from '../currency-selector';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { Balance } from '../balance';

interface InputWithCurrencySelectorProps {
  readonly type: keyof typeof FIELD;
}

export const InputWithCurrencySelector = ({
  type
}: InputWithCurrencySelectorProps) => {
  const { selectedTokensAmount, onChangeSelectedTokensAmount } =
    useDEXSwapContextSelector();
  const label = type === 'INPUT' ? 'You pay' : 'You receive';

  const onChangeTokenAmount = (value: string) => {
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeSelectedTokensAmount(type, finalValue);
  };

  return (
    <View style={styles.wrapper}>
      <Text>{label}</Text>
      <View style={styles.upperRow}>
        <TextInput
          value={selectedTokensAmount[type]}
          style={styles.input}
          type="number"
          keyboardType="decimal-pad"
          onChangeText={onChangeTokenAmount}
          placeholder="0"
        />

        <CurrencySelector type={type} />
      </View>

      <Balance type={type} />
    </View>
  );
};
