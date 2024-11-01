import React, { useMemo, useState } from 'react';
import { Insets, Platform, View } from 'react-native';
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
import { COLORS } from '@constants/colors';

interface InputWithTokenSelectProps {
  readonly type: SelectedTokensKeys;
  readonly estimated: boolean;
}

const HIT_SLOP: Insets = {
  top: 32,
  bottom: 32,
  left: 24
};

export const InputWithTokenSelect = ({
  type,
  estimated
}: InputWithTokenSelectProps) => {
  const { t } = useTranslation();
  const { selectedTokensAmount, setLastChangedInput } =
    useSwapContextSelector();
  const { onChangeSelectedTokenAmount } = useSwapFieldsHandler();

  const [isInputFocused, setIsInputFocused] = useState(false);

  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');

  const onChangeTokenAmount = (value: string) => {
    setLastChangedInput(type);
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeSelectedTokenAmount(type, finalValue);
  };

  const onToggleInputFocus = () => {
    setIsInputFocused((prev) => !prev);
  };

  const selection = useMemo(() => {
    if (!isInputFocused && selectedTokensAmount[type].length > 0) {
      return { start: 0, end: 0 };
    }
  }, [isInputFocused, selectedTokensAmount, type]);

  const value = useMemo(() => {
    return StringUtils.wrapAndroidString(
      selectedTokensAmount[type],
      isInputFocused,
      16,
      true
    );
  }, [isInputFocused, selectedTokensAmount, type]);

  const inputStyle = useMemo(() => {
    return Platform.select({
      android: { ...styles.input, ...styles.inputAndroidSpecified },
      ios: styles.input,
      default: styles.input
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {label} {estimated && `(${t('swap.label.estimated')})`}
      </Text>
      <View style={styles.upperRow}>
        <TokenSelector type={type} />
        <View style={{ maxWidth: '60%' }}>
          <TextInput
            hitSlop={HIT_SLOP}
            numberOfLines={1}
            onFocus={onToggleInputFocus}
            onBlur={onToggleInputFocus}
            selection={selection}
            value={value}
            style={inputStyle}
            type="number"
            keyboardType="decimal-pad"
            onChangeText={onChangeTokenAmount}
            placeholder="0"
          />
        </View>
      </View>

      <Balance type={type} />
    </View>
  );
};
