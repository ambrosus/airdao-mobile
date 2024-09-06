import React, { useMemo, useState } from 'react';
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
import { isAndroid } from '@utils/isPlatform';

interface InputWithTokenSelectProps {
  readonly type: SelectedTokensKeys;
  readonly estimated: boolean;
}

export const InputWithTokenSelect = ({
  type,
  estimated
}: InputWithTokenSelectProps) => {
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

  const [isInputFocused, setIsInputFocused] = useState(false);

  const onToggleInputFocus = () => {
    setIsInputFocused((prev) => !prev);
  };

  const selection = useMemo(() => {
    if (!isInputFocused && isAndroid && selectedTokensAmount[type].length > 0) {
      return { start: 0, end: 0 };
    }
  }, [isInputFocused, selectedTokensAmount, type]);

  return (
    <View style={styles.wrapper}>
      <Text>
        {label} {estimated && `(${t('swap.label.estimated')})`}
      </Text>
      <View style={styles.upperRow}>
        <TextInput
          onFocus={onToggleInputFocus}
          onBlur={onToggleInputFocus}
          selection={selection}
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
