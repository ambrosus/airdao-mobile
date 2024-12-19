import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputRef, Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { COLORS } from '@constants/colors';
import { Balance, TokenSelector } from '@features/swap/components/composite';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapFieldsHandler } from '@features/swap/lib/hooks';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { StringUtils, NumberUtils } from '@utils';
import { styles } from './styles';

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

  const textInputRef = useRef<InputRef>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputContainerWidth, setInputContainerWidth] = useState(0);

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
    const maxCharacterLimit = Math.floor(inputContainerWidth / 16);

    return StringUtils.wrapAndroidString(
      selectedTokensAmount[type],
      isInputFocused,
      maxCharacterLimit,
      true
    );
  }, [inputContainerWidth, isInputFocused, selectedTokensAmount, type]);

  const inputStyle = useMemo(() => {
    return Platform.select({
      android: { ...styles.input, ...styles.inputAndroidSpecified },
      ios: styles.input,
      default: styles.input
    });
  }, []);

  const onInputContainerPress = useCallback(
    () => textInputRef.current?.focus(),
    []
  );

  const onLayoutEventHandle = useCallback(
    (event: LayoutChangeEvent) =>
      setInputContainerWidth(event.nativeEvent.layout.width),
    []
  );

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
        <Pressable
          onLayout={onLayoutEventHandle}
          onPress={onInputContainerPress}
          style={styles.inputContainer}
        >
          <TextInput
            value={value}
            placeholder="0"
            type="number"
            numberOfLines={1}
            keyboardType="decimal-pad"
            onFocus={onToggleInputFocus}
            onBlur={onToggleInputFocus}
            selection={selection}
            onChangeText={onChangeTokenAmount}
            style={inputStyle}
            textAlign="right"
          />
        </Pressable>
      </View>

      <Balance type={type} />
    </View>
  );
};
