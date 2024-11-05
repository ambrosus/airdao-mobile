import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, View } from 'react-native';
import { styles } from './styles';
import { InputRef, Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { BalanceRow, TokenSelector } from '@components/modular';
import { Token } from '@models';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';

interface InputWithTokenSelectProps {
  readonly value: string;
  readonly label: string;
  readonly token: Token;
  readonly onChangeText: (text: string) => void;
  readonly onPressMaxAmount: (amount?: string) => void;
  readonly dispatch?: boolean;
}

export const InputWithTokenSelect = ({
  value,
  label,
  token,
  onChangeText,
  onPressMaxAmount,
  dispatch = true
}: InputWithTokenSelectProps) => {
  const textInputRef = useRef<InputRef>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputContainerWidth, setInputContainerWidth] = useState(0);

  const onChangeTokenAmount = (value: string) => {
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(finalValue, 18);
    onChangeText(finalValue);
  };

  const onToggleInputFocus = () => {
    setIsInputFocused((prev) => !prev);
  };

  const selection = useMemo(() => {
    if (!isInputFocused && value.length > 0) {
      return { start: 0, end: 0 };
    }
  }, [isInputFocused, value.length]);

  const _value = useMemo(() => {
    const maxCharacterLimit = Math.floor(inputContainerWidth / 16);

    return StringUtils.wrapAndroidString(
      value,
      isInputFocused,
      maxCharacterLimit,
      true
    );
  }, [inputContainerWidth, isInputFocused, value]);

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
    <>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {label}
      </Text>
      <View style={styles.upperRow}>
        <TokenSelector token={token} onDismissBottomSheet={() => null} />
        <Pressable
          onLayout={onLayoutEventHandle}
          onPress={onInputContainerPress}
          style={styles.inputContainer}
        >
          <TextInput
            value={_value}
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

      <BalanceRow
        token={token}
        value={value}
        dispatch={dispatch}
        onPressMaxAmount={onPressMaxAmount}
        onChangeText={onChangeText}
      />
    </>
  );
};
