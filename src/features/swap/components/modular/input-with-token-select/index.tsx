import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { Balance, TokenSelector } from '@features/swap/components/composite';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useSwapFieldsHandler } from '@features/swap/lib/hooks';
import { useSwapContextSelector } from '@features/swap/context';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';

interface InputWithTokenSelectProps {
  readonly type: SelectedTokensKeys;
}

export const InputWithTokenSelect = ({ type }: InputWithTokenSelectProps) => {
  const { t } = useTranslation();
  const { selectedTokensAmount, setLastChangedInput } =
    useSwapContextSelector();
  const { onChangeSelectedTokenAmount } = useSwapFieldsHandler();

  const onChangeTokenAmount = (value: string) => {
    setLastChangedInput(type);
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeSelectedTokenAmount(type, finalValue);
  };

  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');

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

        <TokenSelector type={type} />
      </View>

      <Balance type={type} />
    </View>
  );
};
